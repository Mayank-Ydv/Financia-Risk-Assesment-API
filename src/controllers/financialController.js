const FinancialData = require("../models/FinancialData");
// const {redisClient} = require("../config/redis")
const { getClient } = require("../config/redis"); // Import the redis client
// Upload Financial Data
const financialDataQueue = require("../queues/financialQueue");

exports.uploadFinancialData = async (req, res) => {
  try {
    const financialData = req.body;
    if (!Array.isArray(financialData)) {
      return res
        .status(400)
        .json({ error: "Invalid data format. Expected an array." });
    }
    if (financialData.length > 500) {
        return res
          .status(400)
          .json({ error: "Batch size exceeds the limit of 500 records." });
      }
    // ✅ Add data to Bull queue (instead of storing it in MongoDB)
    await financialDataQueue.add(financialData, {
      attempts: 5, // Number of retry attempts
      backoff: 5000,// Wait 5 seconds before retrying
      removeOnComplete: true,
    });

    return res.status(200).json({
      message: "Data enqueued successfully",
      successCount: financialData.length,
      failedCount: 0,
    });
  } catch (error) {
    console.error("❌ Error in uploadFinancialData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to get financial risk assessment data

exports.getRiskAssessment = async (req, res) => {
    const { company_id, reporting_period, industry_sector, page = 1, limit = 10 } = req.query;

    const redisClient = getClient();  // Get redis client safely
    if (!redisClient) {
        console.warn("⚠️ Skipping Redis: Client not available");
    }

    const filter = {};
    if (company_id) filter.company_id = company_id;
    if (reporting_period) filter.reporting_period = reporting_period;
    if (industry_sector) filter.industry_sector = industry_sector;

    try {
        const cacheKey = `riskAssessment:${JSON.stringify(filter)}:page=${page}:limit=${limit}`;

        if (redisClient) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log("✅ Serving from cache");
                return res.json(JSON.parse(cachedData));
            }
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const totalRecords = await FinancialData.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limitNumber);

        const data = await FinancialData.find(filter)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean();

        const updatedData = data.map((record) => {
            const metrics = calculateFinancialMetrics(record);
            return {
                ...record,
                debt_to_equity_ratio: metrics.debtToEquityRatio,
                operating_margin: metrics.operatingMargin,
                return_on_equity: metrics.returnOnEquity,
                z_score: metrics.z_score,
                risk_score: calculateRiskScore(record),
            };
        });

        const response = {
            currentPage: pageNumber,
            totalPages,
            totalRecords,
            data: updatedData,
        };

        if (redisClient) {
            await redisClient.setEx(cacheKey, 600, JSON.stringify(response));
        }

        res.json(response);
    } catch (error) {
        console.error("❌ Error retrieving data:", error);
        res.status(500).json({ message: "Error retrieving data", error: error.message });
    }
};


  

  

function calculateFinancialMetrics(record) {
  const { total_liabilities, total_assets, revenue, net_profit } = record;

  // Ensure no division by zero
  const equity = total_assets - total_liabilities;

  const debtToEquityRatio = equity !== 0 ? total_liabilities / equity : 0;
  const operatingMargin = revenue !== 0 ? (net_profit / revenue) * 100 : 0;
  const returnOnEquity = equity !== 0 ? (net_profit / equity) * 100 : 0;

  // Altman Z-Score Calculation
  const z_score =
    3.3 * (net_profit / total_assets) +
    0.6 * (equity / total_liabilities) +
    1.0 * (revenue / total_assets);

  return { debtToEquityRatio, operatingMargin, returnOnEquity, z_score };
}

function calculateRiskScore(record) {
  const { debtToEquityRatio, operatingMargin, z_score } =
    calculateFinancialMetrics(record);

  let riskScore = 100;

  // Debt-to-Equity Ratio impact
  if (debtToEquityRatio > 1.5) riskScore -= 20;
  else if (debtToEquityRatio > 1.0) riskScore -= 10;

  // Operating Margin impact
  if (operatingMargin < 10) riskScore -= 15;
  else if (operatingMargin < 20) riskScore -= 5;

  // Altman Z-Score impact
  if (z_score < 1.8) riskScore -= 30;
  else if (z_score < 2.5) riskScore -= 10;

  return Math.max(0, Math.min(100, riskScore)); // Ensure score is between 0 and 100
}
