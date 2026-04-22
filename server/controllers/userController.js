const User = require("../models/User");
const Chat = require("../models/Chat");

const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, themePreference } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    user.name = name?.trim() || user.name;
    user.bio = bio?.trim() || user.bio;
    user.themePreference = themePreference || user.themePreference;

    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [chatCount, userCount] = await Promise.all([
      Chat.countDocuments({ user: req.user._id }),
      User.countDocuments()
    ]);

    res.json({
      stats: {
        totalChats: chatCount,
        totalUsers: userCount,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  getDashboardStats
};
