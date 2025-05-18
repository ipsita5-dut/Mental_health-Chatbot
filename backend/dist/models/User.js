"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
// Chat Schema
const chatSchema = new mongoose_1.Schema({
    id: {
        type: String,
        default: () => (0, crypto_1.randomUUID)(),
    },
    content: {
        type: String,
        required: true,
    },
});
// User Schema
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [
        chatSchema
    ],
});
// Create the models
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map