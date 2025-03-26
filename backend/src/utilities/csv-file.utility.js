const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const pathModule = require("path");

// ----------------------------------------------------------------------

/**
 * It takes a path, header, and data as arguments and writes a CSV file to the path with the header and
 * data
 * @param path - The path to the CSV file you want to create.
 * @param header - An array of strings that represent the header of the CSV file.
 * @param data - The data to be written to the CSV file.
 */
const writeCSVFile = async (path, header, data) => {
  // Create necessary folders
  const dir = pathModule.dirname(path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const csvWriter = createCsvWriter({
    path,
    header,
  });

  await csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("CSV file created successfully");
    })
    .catch((error) => {
      console.error(error);
    });

  prependBOM(path);
  return path;
};

/**
 * The function prepends a Byte Order Mark (BOM) to the contents of a file.
 * @param file - The `file` parameter is a string that represents the path to the file that you want to
 * prepend the Byte Order Mark (BOM) to.
 */
function prependBOM(file) {
  let fileContents = fs.readFileSync(file);
  fs.writeFileSync(file, "\ufeff" + fileContents);
}

module.exports = {
  writeCSVFile,
};
