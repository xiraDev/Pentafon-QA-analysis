const { request } = require("express");
const { check, body } = require("express-validator");

exports.validateAudioUpload = () => {
    return [
        check(request.files)
            .exists()
            .withMessage("El archivo es obligatorio")
            .custom((value, { req }) => {
                if (!req.files) throw new Error("Al menos un archivo en formato de audio es requerido");
                return true;
            }),
        body("campaign")
            .exists()
            .notEmpty()
            .withMessage("Se requiere especificar la campaña"),
        body("amount")
            .exists()
            .notEmpty()
            .withMessage("Se requiere especificar la cantidad de archivos a subir"),
    ];
};

