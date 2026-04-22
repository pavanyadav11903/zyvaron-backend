const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  avatar: user.avatar,
  themePreference: user.themePreference,
  createdAt: user.createdAt
});

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  res.json({
    user: sanitizeUser(req.user)
  });
};

module.exports = {
  signup,
  login,
  getCurrentUser
};
