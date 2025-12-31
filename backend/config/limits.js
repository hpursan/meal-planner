const limits = {
    MAX_PLAN_DAYS: parseInt(process.env.MAX_PLAN_DAYS) || 14,

    // Rate Limiting
    GENERATION_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    GENERATION_MAX_REQUESTS: 100, // 100 requests per 15 mins per IP (Safely relaxed)
};

module.exports = limits;
