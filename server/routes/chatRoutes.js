const express = require("express");
const {
  listChats,
  createChat,
  getChatById,
  sendMessage,
  deleteChat
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(listChats).post(createChat);
router.route("/:id").get(getChatById).delete(deleteChat);
router.post("/:id/messages", sendMessage);

module.exports = router;
