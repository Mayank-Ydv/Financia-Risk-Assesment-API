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

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```json
{
    git clone https://github.com/YOUR_GITHUB_USERNAME/financial-risk-api.git
    cd financial-risk-api
}
```

### 2️⃣ Install Dependencies
```json
{
    npm install
}
```

### 3️⃣ Setup Environment Variables
Create a .env file in the root directory and add the following:

```json
{
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/financial-risk-db
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your_secret_key
    RATE_LIMIT_MAX=100
}
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
    "company_id": "C1001",
    "company_name": "TechCorp",
    "reporting_period": "2023-Q4",
    "industry_sector": "Technology",
    "total_assets": 5000000,
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
  "currentPage": 1,
  "totalPages": 1,
  "totalRecords": 1,
  "data": [
    {
      "company_id": "C1001",
      "risk_score": 85,
      "z_score": 2.8,
      "debt_to_equity_ratio": 1.2
    }
  ]
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
### 1️⃣ Test Rate Limiting

```json
{
    npx mocha src/tests/rateLimitTest.js
}  
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

📜 License  
This project is MIT Licensed.  

## ⭐ Contributions  
**🔹 Feel free to fork, clone & contribute!**  
**🔹 Open an issue if you find bugs.**  

### 💙 Star this repo if you find it useful! 🚀