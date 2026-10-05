const errorMiddleware = (
    err,
    req,
    res,
    next
) => {
    console.error(err);

    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.code === "LIMIT_FILE_SIZE" ?
                "File size cannot exceed 10MB" :
                err.message
        });
    }

    if (err.code === 11000) {
        const field =
            Object.keys(err.keyPattern || {})[0];

        return res.status(409).json({
            success: false,
            message: `${field || "Value"} already exists`
        });
    }

    return res.status(
        err.statusCode || 500
    ).json({
        success: false,
        message: err.message ||
            "Internal Server Error"
    });
};

export default errorMiddleware;