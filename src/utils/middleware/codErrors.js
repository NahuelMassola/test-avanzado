const { StatusCodes } = require('http-status-codes')


class HttpResponse {

    //200
    OK(res, message, data) {
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: message,
            data
        })
    }

    //404
    NotFound(res, message, data) {
        return res.status(StatusCodes.NOT_FOUND).json({
            status: StatusCodes.NOT_FOUND,
            message: message,
            data
        })
    }

    //400
    BadRequest(res, message, data) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: message,
            data
        })
    }

    //401
    Unauthorized(res, message, data) {  
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: message,
            data
        })
    }

    //403
    Forbbiden(res, message, data) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: message,
            data
        })
    }

    //500
    Error(res, message, data) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: message,
            data
        })
    }
}


module.exports = HttpResponse
