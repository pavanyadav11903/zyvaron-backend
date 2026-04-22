const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const user = await User.findOne().select("-password");

    if (!user) {
      return res.status(401).json({ message: "No user found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth bypass failed." });
  }
};

const adminOnly = (req, res, next) => {
  next();
};

module.exports = {
  protect,
  adminOnly
};