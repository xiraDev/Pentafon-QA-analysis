const fs = require("fs");
const { parse } = require("csv-parse");

// ----------------------------------------------------------------------

/**
 * It reads a CSV file and returns a promise that resolves to an array of objects.
 * @param path - The path to the CSV file
 * @returns An array of objects.
 */
const readCSVFile = (path) => {
  return new Promise((resolve, reject) => {
    let results = [];

    fs.createReadStream(`${path}`)
      .pipe(parse({ delimiter: ",", from_line: 2, relax_column_count: true }))
      .on("data", (row) => {
        // console.log(row);
        results.push(row);
      })
      .on("end", () => {
        console.log("Finished reading");
        resolve(results);
      })
      .on("error", function (error) {
        console.log(error.message);
        return reject(error.message);
      });
  });
};

module.exports = {
  readCSVFile,
};
