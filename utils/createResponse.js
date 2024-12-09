export const createResponse = (res, statusCode, success, message, data = null) => {
    const responsePayload = {
        statusCode,
        success,
        message,
        data,
    };

    return res.status(statusCode).json(responsePayload);
};

