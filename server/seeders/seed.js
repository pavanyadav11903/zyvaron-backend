const path = require("path");
const dotenv = require("dotenv");
const connectDatabase = require("../config/db");
const User = require("../models/User");
const Chat = require("../models/Chat");

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env")
});

const seed = async () => {
  try {
    await connectDatabase();

    await Chat.deleteMany();
    await User.deleteMany();

    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "Admin123!",
        role: "admin",
        bio: "Administrator account for platform management.",
        themePreference: "dark"
      },
      {
        name: "Demo User",
        email: "demo@example.com",
        password: "Demo123!",
        role: "user",
        bio: "Product designer exploring AI workflows.",
        themePreference: "light"
      }
    ]);

    await Chat.create([
      {
        user: users[1]._id,
        title: "Launch checklist",
        messages: [
          {
            role: "user",
            content: "Help me plan a product launch checklist."
          },
          {
            role: "assistant",
            content: "Start with positioning, landing page copy, onboarding, analytics, support docs, and launch-day monitoring."
          }
        ]
      }
    ]);

    console.log("Dummy data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
