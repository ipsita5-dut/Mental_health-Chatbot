"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token.manager");
const chat_controllers_1 = require("../controllers/chat.controllers");
const validator_1 = require("../utils/validator");
//Protected API
const chatRoutes = (0, express_1.Router)();
// Define chat routes here
chatRoutes.post("/new", (0, validator_1.validate)(validator_1.chatCompletionValidator), token_manager_1.verifyToken, chat_controllers_1.generateChatCompletion);
// get all chats
chatRoutes.get("/all-chats", token_manager_1.verifyToken, chat_controllers_1.sendChatToUser);
//route clear chat
chatRoutes.delete("/delete", token_manager_1.verifyToken, chat_controllers_1.deleteChats);
// Export the chat router
exports.default = chatRoutes;
//# sourceMappingURL=chat.routes.js.map