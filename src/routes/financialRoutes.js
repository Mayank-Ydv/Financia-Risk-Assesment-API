const express = require("express");
const { uploadFinancialData, getRiskAssessment } = require("../controllers/financialController");
const authMiddleware = require("../middleware/authMiddleware");
const limiter = require('../middleware/ratelimiter');


const router = express.Router();

// router.post("/uploadFinancialData", authMiddleware, uploadFinancialData);
router.post("/uploadFinancialData", 
    authMiddleware,    // First authenticate
    limiter,           // Then apply rate limiter
    uploadFinancialData
);
router.get("/getRiskAssessment", authMiddleware, getRiskAssessment);

module.exports = router;
