// utilities
import { isEmpty } from '../helpers';
// utilities
import { fDateTime } from '../utils/format-time-xira';

// ----------------------------------------------------------------------

export const voicebotRecordingsAdapter = (records) => {
  const renderVbtRecordings = {
    count: records.count || 0,
    rows: [],
  };

  records.rows.forEach((_record) => {
    renderVbtRecordings.rows.push(vbtRecordAdapter(_record));
  });

  return renderVbtRecordings;
};

export const vbtRecordAdapter = (record) => ({
  id: record.id,
  customerName: record.customer.name,
  customerPhone: record.customer[record.contactAction.contactField],
  actionStatus: record.actionStatus,
  typification: record.typification,
  gItCallId: record.gItCallId,
  twilioCallSid: record.twilioCallSid,
  createdAt: fDateTime(record.createdAt),
});
export const shortingAdapter = (shorting = []) => {
  if (isEmpty(shorting)) return [];

  const order = shorting[0].desc ? 'DESC' : 'ASC';
  return [[shorting[0].id, order]];
};

export const vbtRecordMediaAdapter = (record, id) => ({
  id,
  name: record.name,
  size: record.size,
  audio: record.audio,
});

export const groupByDateAndCallId = (data) => {
  // Ordenamos los datos por la propiedad createdAt
  data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Agrupamos por fecha
  const result = data.reduce((acc, item) => {
    // Extraemos la fecha en formato YYYY-MM-DD
    const date = item.createdAt.split('T')[0];

    // Buscamos si ya existe un objeto con esta fecha
    const existingDate = acc.find((entry) => entry.date === date);

    if (existingDate) {
      // Si existe, añadimos el gItCallId al array de call_id
      existingDate.call_id.push(item.twilioCallSid);
    } else {
      // Si no existe, creamos un nuevo objeto con la fecha y el twilioCallSid
      acc.push({
        date,
        call_id: [item.twilioCallSid],
      });
    }

    return acc;
  }, []);

  return result;
};
