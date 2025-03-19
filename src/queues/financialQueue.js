const Queue = require("bull");
const FinancialData = require("../models/FinancialData");

const financialDataQueue = new Queue("financialDataQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Process the financial data queue
financialDataQueue.process(async (job) => {
  try {
    const data = job.data;
    let successCount = 0;
    let failedCount = 0;

    for (const record of data) {
      try {
        await FinancialData.updateOne(
          {
            company_id: record.company_id,
            reporting_period: record.reporting_period,
          },
          { $set: record },
          { upsert: true }
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to process record: ${record.company_id}`, err);
        failedCount++;
      }
    }

    console.log(
      `Job ${job.id} processed: ${successCount} success, ${failedCount} failed`
    );

    return { successCount, failedCount }; 
  } catch (error) {
    console.error("Queue Processing Error:", error);
    throw error; // Ensure job failure is captured
  }
});

module.exports = financialDataQueue;
