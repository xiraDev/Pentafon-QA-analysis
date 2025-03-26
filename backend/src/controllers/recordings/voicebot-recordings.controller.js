// middlewares
const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const {
  validationErrorsEnhancer,
  ErrorResponse,
  toBoolean,
  isEmpty,
} = require("../../helpers");
// repositories
const {
  getAllAudiosFrom1Day,
} = require("../../repositories/recordings/voicebot-recordings-drive.repository");
const {
  FetchVbtRecordsConfig,
  UpdateVbtRecordsConfig,
} = require("../../repositories/sql/voicebot-recordings-config.repository");
const {
  getAudioByCallSid,
} = require("../../repositories/recordings/voicebot-recordings-twilio.repository");
const {
  getAudioByName,
} = require("../../repositories/recordings/voicebot-recordings-asterisk.repository");
const {
  getS3Audios,
} = require("../../repositories/recordings/voicebot-recordings-aws-s3.repository");

// ----------------------------------------------------------------------

// const RESOURCE = "Grabación";
const RESOURCES = "Grabaciones";

exports.getVoicebotRecordDrive = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { campaign, date, download = "false" } = req.query;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    toBoolean(download) &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audioFiles = await getAllAudiosFrom1Day(campaign, date, [id]);

  if (!audioFiles || !audioFiles.length) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(
    res,
    audioFiles.map((file) => ({
      name: file.name,
      size: file.fileSize,
      audio: Buffer.from(file.buffer).toString("base64"),
    })),
    { es: `${RESOURCES} cargadas`, en: `Recordings found` },
    200
  );

  if (toBoolean(download)) {
    const recordingConfig = vbtRecordingsConfig.rows[0];

    const newStorage = recordingConfig.currentStorage + audioFiles[0].fileSize;
    await UpdateVbtRecordsConfig(
      { fileCount: recordingConfig.fileCount + 1, currentStorage: newStorage },
      recordingConfig.id
    );
  }
});

exports.getVoicebotRecordsDrive = asyncHandler(async (req, res, next) => {
  const { campaign, date, call_id, download = false } = req.body;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    download &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audioFiles = await getAllAudiosFrom1Day(campaign, date, call_id);

  if (!audioFiles || !audioFiles.length) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(
    res,
    audioFiles.map((file) => ({
      name: file.name,
      size: file.fileSize,
      audio: Buffer.from(file.buffer).toString("base64"),
    })),
    { es: `${RESOURCES} cargadas`, en: `Recordings found` },
    200
  );

  if (download) {
    const vbtRecordingsConfig2 = await FetchVbtRecordsConfig({});

    const recordingConfig = vbtRecordingsConfig2.rows[0];

    const newStorage =
      recordingConfig.currentStorage +
      audioFiles.reduce((acc, file) => acc + file.fileSize, 0);
    await UpdateVbtRecordsConfig(
      {
        fileCount: recordingConfig.fileCount + audioFiles.length,
        currentStorage: newStorage,
      },
      recordingConfig.id
    );
  }
});

exports.getVoicebotRecordTwilio = asyncHandler(async (req, res, next) => {
  const callSid = req.params.id;
  const { download = "false" } = req.query;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }
  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    toBoolean(download) &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audio = await getAudioByCallSid(callSid);

  if (!audio) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(res, [audio], { es: `${RESOURCES} cargadas`, en: "Record found" }, 200);

  if (audio && toBoolean(download)) {
    const recordingConfig = vbtRecordingsConfig.rows[0];

    const newStorage = recordingConfig.currentStorage + audio.size;
    await UpdateVbtRecordsConfig(
      { fileCount: recordingConfig.fileCount + 1, currentStorage: newStorage },
      recordingConfig.id
    );
  }
});

exports.getManyVoicebotRecordsTwilio = asyncHandler(async (req, res, next) => {
  const { call_id, download = false } = req.body;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    download &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audios = await Promise.all(
    call_id.map(async (call) => {
      const audio = await getAudioByCallSid(call);
      return audio;
    })
  );

  if (!audios || !audios.length) {
    return next(new ErrorResponse({ es: "No se encontraron audios solicitados", en: "Audios not found" }, 404));
  }

  successResponse(res, audios, { es: `${RESOURCES} cargadas`, en: "Recordings found" }, 200);

  if (audios.length && download) {
    const vbtRecordingsConfig2 = await FetchVbtRecordsConfig({});

    const recordingConfig = vbtRecordingsConfig2.rows[0];

    const newStorage =
      recordingConfig.currentStorage +
      audios.reduce((acc, file) => acc + file.size, 0);
    await UpdateVbtRecordsConfig(
      {
        fileCount: recordingConfig.fileCount + audios.length,
        currentStorage: newStorage,
      },
      recordingConfig.id
    );
  }
});

exports.getVoicebotRecordAsterisk = asyncHandler(async (req, res, next) => {
  const callSid = req.params.id;
  const { download = "false" } = req.query;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }
  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    toBoolean(download) &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audio = await getAudioByName(callSid);

  if (isEmpty(audio)) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(res, audio, { es: `${RESOURCES} cargadas`, en: "Recording found" }, 200);

  if (audio.length && toBoolean(download)) {
    const recordingConfig = vbtRecordingsConfig.rows[0];

    const newStorage = recordingConfig.currentStorage + audio[0].size;
    await UpdateVbtRecordsConfig(
      { fileCount: recordingConfig.fileCount + 1, currentStorage: newStorage },
      recordingConfig.id
    );
  }
});

exports.getManyVoicebotRecordsAsterisk = asyncHandler(
  async (req, res, next) => {
    const { call_id, download = false } = req.body;

    const errors = validationErrorsEnhancer(req);

    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

    if (
      download &&
      vbtRecordingsConfig.rows[0].currentStorage >=
      vbtRecordingsConfig.rows[0].storageLimit
    ) {
      return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
    }

    const audios = await getAudioByName(call_id);

    if (!audios || !audios.length) {
      return next(new ErrorResponse({ es: "No se encontraron audios solicitados", en: "Audios not found" }, 404));
    }

    successResponse(res, audios, { es: `${RESOURCES} cargadas`, en: "Recordings found" }, 200);

    if (audios.length && download) {
      const vbtRecordingsConfig2 = await FetchVbtRecordsConfig({});

      const recordingConfig = vbtRecordingsConfig2.rows[0];

      const newStorage =
        recordingConfig.currentStorage +
        audios.reduce((acc, file) => acc + file.size, 0);
      await UpdateVbtRecordsConfig(
        {
          fileCount: recordingConfig.fileCount + audios.length,
          currentStorage: newStorage,
        },
        recordingConfig.id
      );
    }
  }
);

exports.getVoicebotRecordAWSS3 = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { campaign, date, download = "false" } = req.query;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    toBoolean(download) &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audioFiles = await getS3Audios(campaign, [id]);

  if (!audioFiles || !audioFiles.length) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(
    res,
    audioFiles.map((file) => ({
      name: file.name,
      size: file.fileSize,
      audio: file.chunks,
    })),
    { es: `${RESOURCES} cargadas`, en: "Record found" },
    200
  );

  if (toBoolean(download)) {
    const recordingConfig = vbtRecordingsConfig.rows[0];

    const newStorage = recordingConfig.currentStorage + audioFiles[0].fileSize;
    await UpdateVbtRecordsConfig(
      { fileCount: recordingConfig.fileCount + 1, currentStorage: newStorage },
      recordingConfig.id
    );
  }
});

exports.getVoicebotRecordsAWSS3 = asyncHandler(async (req, res, next) => {
  const { campaign, date, call_id, download = false } = req.body;

  const errors = validationErrorsEnhancer(req);

  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const vbtRecordingsConfig = await FetchVbtRecordsConfig({});

  if (
    download &&
    vbtRecordingsConfig.rows[0].currentStorage >=
    vbtRecordingsConfig.rows[0].storageLimit
  ) {
    return next(new ErrorResponse({ es: "Limite de almacenamiento alcanzado", en: "Storage limit exceeded" }, 400));
  }

  const audioFiles = await getS3Audios(campaign, call_id);

  if (!audioFiles || !audioFiles.length) {
    return next(new ErrorResponse({ es: "No se encontro el audio solicitado", en: "Audio not found" }, 404));
  }

  successResponse(
    res,
    audioFiles.map((file) => ({
      name: file.name,
      size: file.fileSize,
      audio: file.chunks,
    })),
    { es: `${RESOURCES} cargadas`, en: "Recordings found" },
    200
  );

  if (download) {
    const vbtRecordingsConfig2 = await FetchVbtRecordsConfig({});

    const recordingConfig = vbtRecordingsConfig2.rows[0];

    const newStorage =
      recordingConfig.currentStorage +
      audioFiles.reduce((acc, file) => acc + file.fileSize, 0);
    await UpdateVbtRecordsConfig(
      {
        fileCount: recordingConfig.fileCount + audioFiles.length,
        currentStorage: newStorage,
      },
      recordingConfig.id
    );
  }
});
