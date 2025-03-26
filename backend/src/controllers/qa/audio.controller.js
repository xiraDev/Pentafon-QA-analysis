const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const { ErrorResponse, validationErrorsEnhancer } = require("../../helpers");
// repositories
const { processAudio } = require("../../repositories/qa_audios.repository");

const fs = require("node:fs")
const path = require("node:path")

// ----------------------------------------------------------------------

const RESOURCE = "Procesamiento de audio";
const RESOURCES = "Procesamiento de audios";


exports.uploadAudio = asyncHandler(async (req, res, next) => {
    try {
        const files = req.files
        const amount = req.body.amount
        const campaign = req.body.campaign

        const errors = validationErrorsEnhancer(req);

        if (errors !== undefined) {
            return next(new ErrorResponse(errors, 422));
        }

        const filesArr = []
        for (let i = 0; i < Number(amount); i++) {
            filesArr.push(processAudio(files[`file_${i}`], campaign))
        }

        const resultsArr = []
        await Promise.all(filesArr)
            .then(r => resultsArr.push(...r))
            .then(() => cleanTempFolder(path.join(__dirname, "../../uploads")))
            .then(() => cleanTempFolder(path.join(__dirname, "../../tmp")))
            .catch(err => console.error(err))

        console.log(resultsArr)

        successResponse(res, { results: resultsArr }, `${RESOURCES} completado`, 201);
    } catch (error) {
        console.error("Error al subir a S3:", error);
        res.status(500).json({ error: "Error al subir el file" });
    }
});

function cleanTempFolder(pathToClean) {
    try {


        // Verificar si la ruta existe y es un pathToClean
        if (!fs.existsSync(pathToClean)) {
            throw new Error(`PathToClean ${pathToClean} doesn't exists`);
        }

        if (!fs.statSync(pathToClean).isDirectory()) {
            throw new Error(`Path ${pathToClean} is not a folder`);
        }


        const files = fs.readdirSync(pathToClean);
        const resultado = {
            eliminados: 0,
            errores: []
        };

        for (const file of files) {
            const fullFilePath = path.join(pathToClean, file);

            try {
                fs.unlinkSync(fullFilePath);
                resultado.eliminados++;
            } catch (error) {
                resultado.errores.push({
                    file: fullFilePath,
                    error: error.message
                });
            }

        }

        console.log(`${pathToClean} folder cleaned`)
    } catch (error) {
        console.error("Error al vaciar la carpeta tmp", error)
    }
}