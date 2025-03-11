const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const authenticateUser = (req, res, next) => {
    try {

        // Extract token from cookies, body, or header
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user info to request
            // console.log("Token Verified:", decoded);
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

module.exports = authenticateUser;

