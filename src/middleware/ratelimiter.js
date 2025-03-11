const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests, please try again later.',
    keyGenerator: (req) => {
        // Use authenticated user ID if available
        return req.user ? req.user.id : req.ip;
    },
    validate: { trustProxy: true },
    standardHeaders: true,
    legacyHeaders: false
});