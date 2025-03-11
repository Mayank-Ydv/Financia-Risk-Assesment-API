const mongoose = require("mongoose");
const Queue = require("bull");
const FinancialData = require("../models/FinancialData"); // Adjust the import path as needed

// Mongoose connection string for your test database
const mongoURI = "mongodb://127.0.0.1:27017/financialRiskTestDB"; // Use a separate test DB

// Data to test
const testData = [
    {
        company_id: "C12345",
        company_name: "TechCorp Ltd.",
        reporting_period: "2023-Q4",
        industry_sector: "Technology",
        total_assets: 5000000,
        total_liabilities: 2000000,
        revenue: 1500000,
        net_profit: 300000,
        debt_to_equity_ratio: 1.2,
        cash_flow: 500000,
        operating_margin: 15,
        return_on_equity: 10.5,
        interest_coverage_ratio: 3.5,
        z_score: 2.8,
        risk_score: 75
    },
    {
        company_id: "C12346",
        company_name: "Innovative Inc.",
        reporting_period: "2023-Q4",
        industry_sector: "Technology",
        total_assets: 6000000,
        total_liabilities: 2500000,
        revenue: 1600000,
        net_profit: 350000,
        debt_to_equity_ratio: 1.1,
        cash_flow: 550000,
        operating_margin: 18,
        return_on_equity: 12.5,
        interest_coverage_ratio: 4.0,
        z_score: 3.0,
        risk_score: 80
    }
];

// Set up the queue with configuration
const financialDataQueue = new Queue("financialDataQueue", {
    redis: { host: "127.0.0.1", port: 6379 },
    limiter: {
        groupKey: "financialDataQueue",
        max: 100, // Max 100 jobs at a time
        duration: 10000, // 10 seconds in milliseconds
    }
});

// Process jobs with retry logic
financialDataQueue.process(async (job) => {
    try {
        const data = job.data;
        // Insert or update data
        for (const record of data) {
            await FinancialData.updateOne(
                { company_id: record.company_id, reporting_period: record.reporting_period },
                { $set: record },
                { upsert: true }
            );
        }
        console.log(`✅ Processed batch successfully`);
    } catch (error) {
        console.error("❌ Error during job processing:", error);
        throw error; // Ensure retry logic is triggered in case of an error
    }
});

// Test function to add jobs and test the system
async function testQueueProcessing() {
    try {
        // Connect to MongoDB test database
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB for testing.");

        // Create a dataset of more than 100 records to test rate-limiting behavior
        const largeTestData = [];
        for (let i = 0; i < 520; i++) {
            largeTestData.push({
                company_id: `C1234${i}`,
                company_name: `Company ${i}`,
                reporting_period: "2023-Q4",
                industry_sector: "Technology",
                total_assets: 5000000 + i * 1000,
                total_liabilities: 2000000 + i * 500,
                revenue: 1500000 + i * 200,
                net_profit: 300000 + i * 50,
                debt_to_equity_ratio: 1.2 + (i % 2),
                cash_flow: 500000 + i * 1000,
                operating_margin: 15 + (i % 5),
                return_on_equity: 10.5 + (i % 3),
                interest_coverage_ratio: 3.5 + (i % 2),
                z_score: 2.8 + (i % 1),
                risk_score: 75 + (i % 10)
            });
        }

        // Add jobs to the queue (enqueuing more than 100 test data records)
        console.log("🔄 Enqueuing a large set of financial data...");
        await financialDataQueue.add(largeTestData, {
            attempts: 5, // Set the max retries to 5 attempts per job
            backoff: {
                type: "exponential", // Exponential backoff in case of retries
                delay: 5000 // Delay between retries (in ms)
            }
        });

        // Monitor queue completion
        financialDataQueue.on("completed", async (job) => {
            console.log(`✅ Job ${job.id} completed!`);
        });

        // Monitor job failures
        financialDataQueue.on("failed", (job, err) => {
            console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
        });

        // Verify data is correctly inserted/updated in MongoDB after completion
        financialDataQueue.on("completed", async () => {
            for (const record of largeTestData) {
                const result = await FinancialData.findOne({
                    company_id: record.company_id,
                    reporting_period: record.reporting_period
                });
                if (result) {
                    console.log(`✅ Successfully processed ${record.company_id} for ${record.reporting_period}`);
                } else {
                    console.log(`❌ Failed to process ${record.company_id} for ${record.reporting_period}`);
                }
            }
        });

    } catch (error) {
        console.error("❌ Test setup error:", error);
    }
}

// Run the test
testQueueProcessing();
// node src/tests/testQueue.js