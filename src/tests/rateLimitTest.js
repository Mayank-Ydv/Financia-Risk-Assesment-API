const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');

chai.use(chaiHttp);

describe('Rate Limiter Test', function() {
    this.timeout(20000);
    
    // Create test user token
    let authToken;
    
    before(async () => {
        // Login to get valid token
        const res = await chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'test123'
            });
        authToken = res.body.token;
    });

    it('should block after 100 authenticated requests', async () => {
        const mockData = {
            company: "Test Corp",
            year: 2023,
            revenue: 5000000,
            expenses: 3500000
        };

        // Send 100 authenticated requests
        const requests = Array(100).fill().map(() => 
            chai.request(app)
                .post('/api/uploadFinancialData')
                .set('Authorization', `Bearer ${authToken}`)
                .send(mockData)
        );

        const responses = await Promise.all(requests);
        const successCount = responses.filter(r => r.status === 201).length;

        // Test 101st request
        try {
            await chai.request(app)
                .post('/api/uploadFinancialData')
                .set('Authorization', `Bearer ${authToken}`)
                .send(mockData);
        } catch (err) {
            expect(err.status).to.equal(429);
            expect(err.response.body.message).to.include('Too many requests');
        }

        expect(successCount).to.equal(100);
    });
});