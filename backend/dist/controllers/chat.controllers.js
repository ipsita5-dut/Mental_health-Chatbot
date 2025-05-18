"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.sendChatToUser = exports.generateChatCompletion = void 0;
const gemini_api_1 = require("../config/gemini-api");
const User_1 = require("../models/User");
// Function to generate chat completion
const generateChatCompletion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure the message from the request body
        const { message } = req.body;
        // Validate if message is provided
        if (!message) {
            res.status(400).json({ message: "Prompt (message) is required" });
            return;
        }
        // Retrieve the user based on the JWT token data stored in res.locals
        const user = yield User_1.User.findById(res.locals.jwtData.id);
        if (!user) {
            res.status(401).json({ message: "User not registered or token malfunctioned" });
            return;
        }
        // Fetch the user's previous chats (if any) for context
        const previousChats = user.chats.map(chat => chat.content).join("\n"); // Joining previous chats for context
        // Combine the previous chats with the new message to send to the Gemini API
        const fullPrompt = previousChats + "\n" + message; // Combining previous chats with the new message
        // Call the generateResult function to get the response from Gemini AI
        const result = yield (0, gemini_api_1.generateResult)(fullPrompt);
        // Save the new chat message to the user's history (both user and bot responses)
        user.chats.push({ content: message });
        user.chats.push({ content: result }); // Save the AI's response
        yield user.save();
        // Send the generated result as a response
        res.status(200).json({
            message: "Success",
            response: result, // Response from Gemini AI
            chatHistory: user.chats // Return the updated chat history
        });
    }
    catch (error) {
        // Enhanced error handling for different error types
        if (error instanceof Error) {
            console.error("Error generating chat completion:", error);
            res.status(500).json({ message: "Failed to generate chat completion", error: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Failed to generate chat completion", error: "Unknown error" });
        }
    }
});
exports.generateChatCompletion = generateChatCompletion;
const sendChatToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to verify user with ID(in chat-controllers):", res.locals.jwtData.id);
        const user = yield User_1.User.findById(res.locals.jwtData.id);
        if (!user) {
            console.error("User not found or token malfunctioned for ID(in chat-controllers):", res.locals.jwtData.id);
            res.status(401).json({ message: "User not registered OR Token Malfunctioned" });
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            console.error("Permissions mismatch for user ID:", user._id.toString(), "and token ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "Permissions didn't match" });
            return;
        }
        console.log("User verified successfully:", user.username);
        res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        }
        else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
});
exports.sendChatToUser = sendChatToUser;
const deleteChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to verify user with ID(in chat-controllers(deletechats)):", res.locals.jwtData.id);
        const user = yield User_1.User.findById(res.locals.jwtData.id);
        if (!user) {
            console.error("User not found or token malfunctioned for ID(in chat-controllers):", res.locals.jwtData.id);
            res.status(401).json({ message: "User not registered OR Token Malfunctioned" });
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            console.error("Permissions mismatch for user ID:", user._id.toString(), "and token ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "Permissions didn't match" });
            return;
        }
        console.log("User verified successfully:", user.username);
        //@ts-ignore
        user.chats = [];
        yield user.save();
        res.status(200).json({ message: "OK", });
    }
    catch (error) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        }
        else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
});
exports.deleteChats = deleteChats;
//# sourceMappingURL=chat.controllers.js.map