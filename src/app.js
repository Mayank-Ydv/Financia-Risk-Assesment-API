const express = require('express');
const helmet = require('helmet'); // Security middleware
const connectDB = require('./config/db');
const financialRoutes = require('./routes/financialRoutes');
const cookieParser = require("cookie-parser");

require('dotenv').config();

const authRoutes = require("./routes/authRoutes");

// Create SINGLE app instance
const app = express();

// Security middleware (should come first)
app.use(helmet());

// Configure Helmet with content security policy (optional)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
  }
}));

// Database connection
connectDB();

// Additional middleware
app.use(express.json());
app.use(cookieParser());



// Routes
app.use('/api', financialRoutes);
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Export for testing
module.exports = app;

// Start server only in non-test environments
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}