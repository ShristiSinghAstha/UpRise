import { logger } from '../utils/logger.js';

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = 404;
        logger.warn(`CastError for ID: ${err.value} on route ${req.method} ${req.originalUrl}`);
    } else {
        // Log all other errors
        if (statusCode >= 500) {
            logger.error(`500 Error: ${err.message} on route ${req.method} ${req.originalUrl}`, { stack: err.stack });
        } else {
            logger.warn(`${statusCode} Client Error: ${err.message} on route ${req.method} ${req.originalUrl}`);
        }
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
