// server/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Set a default status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    res.json({
        message: err.message,
        // In a production environment, you would not send the stack trace
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
