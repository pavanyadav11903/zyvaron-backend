const Chat = require("../models/Chat");
const { getAiResponse } = require("../services/aiService");

const listChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: "New conversation",
      messages: []
    });

    res.status(201).json({ chat });
  } catch (error) {
    next(error);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found.");
    }

    res.json({ chat });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      res.status(400);
      throw new Error("Prompt is required.");
    }

    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found.");
    }

    chat.messages.push({
      role: "user",
      content: prompt.trim()
    });

    if (chat.messages.length === 1) {
      chat.title = prompt.trim().slice(0, 40);
    }

    const aiReply = await getAiResponse({
      prompt: prompt.trim(),
      userName: req.user.name
    });

    chat.messages.push({
      role: "assistant",
      content: aiReply
    });

    await chat.save();

    res.json({
      message: "Response generated successfully.",
      chat
    });
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found.");
    }

    res.json({ message: "Chat deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listChats,
  createChat,
  getChatById,
  sendMessage,
  deleteChat
};
