const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error (for debugging)

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode).json({
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : null, 
    });
};

module.exports = errorHandler;
