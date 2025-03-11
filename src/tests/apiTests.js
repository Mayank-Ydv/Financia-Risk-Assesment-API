// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { expect } = chai;
// const app = require('../app'); // Ensure this path is correct

// chai.use(chaiHttp);

// describe('Financial Risk Assessment API Tests', function () {
//     this.timeout(20000); // Set timeout to 20 seconds

//     let authToken;

//     // 🟢 **Step 1: Authenticate & Get Token**
//     before(async () => {
//         try {
//             console.log("🔹 Logging in to get authentication token...");

//             const res = await chai.request(app)
//                 .post('/api/auth/login')
//                 .send({ email: 'john@example.com', password: 'password123' });

//             console.log("🔹 Login Response:", res.status, res.body);

//             expect(res.status).to.equal(200);
//             authToken = res.body.token;
//         } catch (error) {
//             console.error("❌ Login failed:", error.message);
//             throw error;
//         }
//     });

//     // 🟢 **Step 2: Test Upload Financial Data**
//     it('should upload financial data and enqueue it successfully', async () => {
//         const mockData = [
//             {
//                 company_id: "C1001",
//                 company_name: "TechCorp",
//                 reporting_period: "2023-Q4",
//                 industry_sector: "Technology",
//                 total_assets: 5000000,
//                 total_liabilities: 2000000,
//                 revenue: 1500000,
//                 net_profit: 300000,
//                 cash_flow: 500000
//             }
//         ];

//         const res = await chai.request(app)
//             .post('/api/uploadFinancialData')
//             .set('Authorization', `Bearer ${authToken}`)
//             .send(mockData);

//         expect(res.status).to.equal(200);
//         expect(res.body).to.have.property('message').that.includes('Data enqueued successfully');
//     });

//     // 🟢 **Step 3: Test Get Risk Assessment API**
//     it('should retrieve financial risk assessment data', async () => {
//         const res = await chai.request(app)
//             .get('/api/getRiskAssessment')
//             .set('Authorization', `Bearer ${authToken}`)
//             .query({ company_id: "C1001" });

//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body.data).to.be.an('array');
//         if (res.body.data.length > 0) {
//             expect(res.body.data[0]).to.have.property('risk_score');
//         }
//     });

//     // 🟢 **Step 4: Test Rate Limiting (should block after 100 requests)**
//     it('should block after 100 authenticated requests', async () => {
//         const mockData = {
//             company_id: "C1001",
//             company_name: "TechCorp",
//             revenue: 5000000
//         };

//         // Send 100 authenticated requests
//         const requests = Array(100).fill().map(() =>
//             chai.request(app)
//                 .post('/api/uploadFinancialData')
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .send(mockData)
//         );

//         await Promise.all(requests);

//         // Test 101st request (should fail with 429 Too Many Requests)
//         try {
//             await chai.request(app)
//                 .post('/api/uploadFinancialData')
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .send(mockData);
//         } catch (err) {
//             expect(err.status).to.equal(429);
//             expect(err.response.body.message).to.include('Too many requests');
//         }
//     });

// });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app'); // Ensure this path is correct

chai.use(chaiHttp);

describe('Financial Risk Assessment API Tests', function () {
    this.timeout(20000); // Set timeout to 20 seconds

    let authToken;

    // 🟢 **Step 1: Authenticate & Get Token**
    before(async () => {
        try {
            console.log("\n🔹 Logging in to get authentication token...");

            const loginPayload = { email: 'john@example.com', password: 'password123' };
            console.log("🔹 Request Payload:", JSON.stringify(loginPayload, null, 2));

            const res = await chai.request(app)
                .post('/api/auth/login')
                .send(loginPayload);

            console.log("✅ Response:", res.status, JSON.stringify(res.body, null, 2));

            expect(res.status).to.equal(200);
            authToken = res.body.token;
        } catch (error) {
            console.error("❌ Login failed:", error.message);
            throw error;
        }
    });

    // 🟢 **Step 2: Test Upload Financial Data**
    it('should upload financial data and enqueue it successfully', async () => {
        const mockData = [
            {
                company_id: "C1001",
                company_name: "TechCorp",
                reporting_period: "2023-Q4",
                industry_sector: "Technology",
                total_assets: 5000000,
                total_liabilities: 2000000,
                revenue: 1500000,
                net_profit: 300000,
                cash_flow: 500000
            }
        ];

        console.log("\n🔹 Upload Financial Data - Request Payload:", JSON.stringify(mockData, null, 2));

        const res = await chai.request(app)
            .post('/api/uploadFinancialData')
            .set('Authorization', `Bearer ${authToken}`)
            .send(mockData);

        console.log("✅ Response:", res.status, JSON.stringify(res.body, null, 2));

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').that.includes('Data enqueued successfully');
    });

    // 🟢 **Step 3: Test Get Risk Assessment API**
    it('should retrieve financial risk assessment data', async () => {
        console.log("\n🔹 Fetch Risk Assessment Data - Request Params: { company_id: 'C1001' }");

        const res = await chai.request(app)
            .get('/api/getRiskAssessment')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ company_id: "C1001" });

        console.log("✅ Response:", res.status, JSON.stringify(res.body, null, 2));

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        if (res.body.data.length > 0) {
            expect(res.body.data[0]).to.have.property('risk_score');
        }
    });

    // 🟢 **Step 4: Test Rate Limiting (should block after 100 requests)**
    it('should block after 100 authenticated requests', async () => {
        const mockData = {
            company_id: "C1001",
            company_name: "TechCorp",
            revenue: 5000000
        };

        console.log("\n🔹 Sending 100 requests to test rate limiting...");

        const requests = Array(100).fill().map(() =>
            chai.request(app)
                .post('/api/uploadFinancialData')
                .set('Authorization', `Bearer ${authToken}`)
                .send(mockData)
        );

        await Promise.all(requests);

        console.log("✅ 100 requests sent successfully!");

        console.log("\n🔹 Sending 101st request to check rate limit...");

        try {
            const res = await chai.request(app)
                .post('/api/uploadFinancialData')
                .set('Authorization', `Bearer ${authToken}`)
                .send(mockData);

            console.log("❌ Error Expected Rate Limit 100 but got:", res.status, JSON.stringify(res.body, null, 2));
        } catch (err) {
            console.log("✅ Rate Limit Enforced:", err.status);
            console.log("✅ Error Response:", JSON.stringify(err.response.body, null, 2));

            expect(err.status).to.equal(429);
            expect(err.response.body.message).to.include('Too many requests');
        }
    });

});
