const variablesError = require("../variablesError");
const { ERROR_GENERICO } = require("../variablesError");

const mdwError = (error, req, res, next) => {
    switch (error.code) {
        case variablesError.ERROR_PRODUCT:
            res
            .status(401)
            .json({error:error.code,msg:error.message,typeError:error.typeError
            })
            break;
        default:
            res.status(ERROR_GENERICO).json({ msg: "Error Generico acaaaaaaaaaaaaaa" })
            break;
    }
}

module.exports = mdwError