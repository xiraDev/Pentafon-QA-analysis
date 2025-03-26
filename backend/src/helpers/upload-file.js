const path = require("path");

// ----------------------------------------------------------------------

/**
 * It takes a file, validates the extension, and then saves it to a folder
 * @param files - The files object from the request.
 * @param [validExtensions] - An array of valid extensions.
 * @param [folder] - The folder where the file will be saved.
 * @returns The name of the file.
 */
const uploadCSVFile = (files, validExtensions = ["csv"], folder = "") => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split(".");
    const extension = cutName[cutName.length - 1];

    // Validate the extension
    if (!validExtensions.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida, solo se permiten archivos con extensión: ${validExtensions}`
      );
    }

    const tmpName = "data" + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tmpName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      console.log("The file has been uploaded successfully");
      resolve(tmpName);
    });
  });
};

/**
 * The `uploadFile` function is a JavaScript function that takes in files, valid extensions, folder,
 * and file name as parameters, and returns a promise that resolves with the temporary name of the
 * uploaded file if successful, or rejects with an error message if there is an error.
 * @param files - An object containing information about the file being uploaded. It typically includes
 * properties like `name`, `size`, `type`, and `data`.
 * @param [validExtensions] - An array of valid file extensions. By default, it is set to an empty
 * array, which means all file extensions are allowed.
 * @param [folder] - The `folder` parameter is used to specify the folder where the uploaded file will
 * be stored. By default, it is set to an empty string, which means the file will be stored in the root
 * directory of the "uploads" folder. However, you can provide a folder name to store the file
 * @param [fileName=data] - The `fileName` parameter is a string that represents the desired name of
 * the uploaded file. By default, it is set to "data".
 * @returns The function `uploadFile` returns a Promise.
 */
const uploadFile = (
  files,
  validExtensions = [""],
  folder = "",
  fileName = "data",
  pathToUse = "../uploads/"
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split(".");
    const extension = cutName[cutName.length - 1];

    // Validate the extension
    if (!validExtensions.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida, solo se permiten archivos con extensión: ${validExtensions}`
      );
    }

    const tmpName = fileName + "." + extension;
    const uploadPath = path.join(__dirname, pathToUse, folder, tmpName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      console.log("The file has been uploaded successfully");
      resolve(tmpName);
    });
  });
};

module.exports = {
  uploadCSVFile,
  uploadFile,
};
