const Queue = require("bull");
const FinancialData = require("../models/FinancialData");

const financialDataQueue = new Queue("financialDataQueue", { 
    redis: { host: "127.0.0.1", port: 6379 } 
});

// Process the financial data queue
financialDataQueue.process(async (job) => {
    try {
        const data = job.data;
        
        for (const record of data) { 
            await FinancialData.updateOne(
                { company_id: record.company_id, reporting_period: record.reporting_period },
                { $set: record },
                { upsert: true }
            );
            console.log(`🚀 Processing Job ${job.id}:`, JSON.stringify(job.data, null, 2));
        }

        console.log(`✅ Job ${job.id} successfully processed`);
    } catch (error) {
        console.error("❌ Queue Processing Error:", error);
    }
});

module.exports = financialDataQueue;
