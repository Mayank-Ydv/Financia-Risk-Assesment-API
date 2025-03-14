# 📊 Financial Risk Assessment API  

🚀 A **Node.js & Express-based** API that assesses financial risk based on company data, utilizing **MongoDB**, **Redis caching**, and **Bull queue processing**.  

---

## 🔥 Features  

✔ **Upload Financial Data via API** (Queued using Bull)  
✔ **Retrieve Risk Assessment Reports** with calculated risk scores  
✔ **Rate Limiting** to prevent API abuse  
✔ **Redis Caching** for optimized performance  
✔ **Unit Tests** using Mocha & Chai  

---

## 🏗️ Architecture & Design  

1️⃣ **Client sends financial data** → Queued in **Bull (Redis-based queue)**  
2️⃣ **Worker processes queued data** → Saves it to **MongoDB**  
3️⃣ **Risk score calculated** based on **financial metrics (Z-score, D/E Ratio, etc.)**  
4️⃣ **Data retrieved via API** → Cached in **Redis for faster access**  

### 📌 Tech Stack  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Queue Processing:** Bull (Redis-based)  
- **Caching:** Redis  
- **Authentication:** JWT  
- **Testing:** Mocha, Chai  

---
### 🏗 Project Structure (Folder & Files)
```
financial-risk-api/
│── src/
│   ├── config/
│   │   ├── db.js           # MongoDB Connection  
│   │   ├── redis.js        # Redis Connection  
│   ├── routes/
│   │   ├── authRoutes.js   # Authentication Routes  
│   │   ├── dataRoutes.js   # Financial Data Upload & Assessment Routes  
│   ├── models/
│   │   ├── User.js         # User Schema (MongoDB)  
│   │   ├── FinancialData.js # Financial Data Schema (MongoDB)  
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT Authentication Middleware  
│   │   ├── rateLimiter.js     # API Rate Limiting Middleware  
│   ├── queue/
│   │   ├── riskAssessmentWorker.js # Bull Worker to process risk assessment  
│   ├── tests/
│   │   ├── rateLimiterTest.js  # Mocha/Chai Tests for Rate Limiting  
│   ├── app.js          # Express Server Setup   
│── .env                # Environment Variables  
│── package.json        # Dependencies & Scripts  
│── README.md           # Project Documentation  
```
---
## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```
    git clone https://github.com/YOUR_GITHUB_USERNAME/financial-risk-api.git
    cd financial-risk-api
```

### 2️⃣ Install Dependencies
```
    npm install

```

### 3️⃣ Setup Environment Variables
Create a .env file in the root directory and add the following:

```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/financial-risk-db
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your_secret_key
    RATE_LIMIT_MAX=100
```
### 4️⃣ Start the Server
For production:
npm start

For development with nodemon:
npm run dev  
📡 API Endpoints  
### 1️⃣ Authentication  
🔹 POST /api/auth/login  

Request:

```json
{ 
  "email": "user@example.com", 
  "password": "yourpassword" 
}
```
Response:

```json
{ 
  "token": "your_jwt_token_here" 
}
```
### 2️⃣ Upload Financial Data
🔹 POST /api/uploadFinancialData

Request:

```json

[
  {
    "company_id": "C135545",
    "company_name": "TechCorp Ltd.",
    "reporting_period": "2023-Q4",
    "industry_sector": "Technology",
    "total_assets": 5000000,
    "interest_coverage_ratio": 1.8,
    "total_liabilities": 2000000,
    "revenue": 1500000,
    "net_profit": 300000,
    "cash_flow": 500000
  }
]
```
Response:

```json
{
  "message": "Data enqueued successfully",
  "successCount": 1,
  "failedCount": 0
}
```
### 3️⃣ Get Risk Assessment
🔹 GET /api/getRiskAssessment?company_id=C1001&reporting_period=2023-Q4  

Response:  

```json
{
  {
    "currentPage": 1,
    "totalPages": 1,
    "totalRecords": 1,
    "data": [
        {
            "_id": "67d00cd10b33fd603590eebd",
            "company_id": "C135545",
            "reporting_period": "2023-Q4",
            "__v": 0,
            "cash_flow": 500000,
            "company_name": "TechCorp Ltd.",
            "createdAt": "2025-03-11T10:13:37.391Z",
            "debt_to_equity_ratio": 0.6666666666666666,
            "industry_sector": "Technology",
            "interest_coverage_ratio": 1.8,
            "net_profit": 300000,
            "operating_margin": 20,
            "return_on_equity": 10,
            "revenue": 1500000,
            "risk_score": 70,
            "total_assets": 5000000,
            "total_liabilities": 2000000,
            "updatedAt": "2025-03-11T11:44:20.343Z",
            "z_score": 1.398
        }
    ]
}
}
```

### 4️⃣ Rate Limiting
After 100 requests, the API returns:  

```json
{  
  "message": "Too many requests, please try again later."  
} 
``` 
🧪 Running Tests  
### 1️⃣ Test All API

```
    npx mocha src/tests/apiTests.js --timeout 20000
```
🛠️ Challenges & Optimizations  
Challenges Faced  
🚧 Efficient financial risk calculation  
🚧 Ensuring high throughput API performance  
🚧 Handling large financial datasets  

## Optimizations Implemented
**🚀 Bull Queue for async data processing**  
**🚀 Redis Caching for fast data retrieval**  
**🚀 Rate Limiting to prevent spam**  

## 🎯 Future Enhancements
**🔹 Implement AI-based risk prediction**  
**🔹 Add real-time notifications for assessments**  
**🔹 Build a dashboard for risk insights**  

## ⭐ Contributions  
**🔹 Feel free to fork, clone & contribute!**  
**🔹 Open an issue if you find bugs.**  

### 💙 Star this repo if you find it useful! 🚀