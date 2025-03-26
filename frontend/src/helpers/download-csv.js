import { download, generateCsv } from "export-to-csv";

export default function downloadCSV(data, config) { 
  const csv = generateCsv(config)(data);
  return download(config)(csv);
}