const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register New User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(newUser);

    res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 🟢 Login User
exports.loginUser = async (req, res) => {
    try {
        // Get data from req body
        const { email, password } = req.body;
    
        // Validation of data
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: "All fields are required",
          });
        }
    
        // Check if user exists or not
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User doesn't exist",
          });
        }
    
        // Compare password securely
        const isPasswordMatch = await bcrypt.compare(password, user.password);
    
        if (!isPasswordMatch) {
          return res.status(401).json({
            success: false,
            message: "Incorrect password",
          });
        }
    
        // Generate Token
        const token = jwt.sign(
          { email: user.email, id: user._id, accountType: user.accountType },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
    
        // Save token to user document (optional)
        user.token = token;
        user.password = undefined; // Remove password from response
    
        // Set cookie for token (optional)
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          httpOnly: true,
        };
    
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "User login successful",
        });
      } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
          success: false,
          message: "Login failed. Please try again later.",
        });
      }
};
