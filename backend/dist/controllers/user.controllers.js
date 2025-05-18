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
exports.userLogout = exports.verifyUser = exports.userLogin = exports.userSignup = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = require("bcrypt");
const token_manager_1 = require("../utils/token.manager");
const constants_1 = require("../utils/constants");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        }
        else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
});
exports.getAllUsers = getAllUsers;
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            res.status(401).json({ message: "User already registered" });
            return;
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const user = new User_1.User({ username, email, password: hashedPassword });
        yield user.save();
        //create token nd store cookie
        res.clearCookie(constants_1.COOKIE_NAME, { path: "/", domain: "localhost", httpOnly: true, signed: true });
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });
        res.status(201).json({ message: "OK", username: user.username, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        }
        else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not registered" });
            return;
        }
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            res.status(403).send("incorrect password");
            return;
        }
        //create token nd store cookie
        res.clearCookie(constants_1.COOKIE_NAME, { path: "/", domain: "localhost", httpOnly: true, signed: true });
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });
        res.status(200).json({ message: "OK", username: user.username, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        }
        else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
});
exports.userLogin = userLogin;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to verify user with ID:", res.locals.jwtData.id);
        const user = yield User_1.User.findById(res.locals.jwtData.id);
        if (!user) {
            console.error("User not found or token malfunctioned for ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "User not registered OR Token Malfunctioned" });
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            console.error("Permissions mismatch for user ID:", user._id.toString(), "and token ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "Permissions didn't match" });
            return;
        }
        console.log("User verified successfully:", user.username);
        res.status(200).json({ message: "OK", username: user.username, email: user.email });
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
exports.verifyUser = verifyUser;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to verify user with ID:", res.locals.jwtData.id);
        const user = yield User_1.User.findById(res.locals.jwtData.id);
        if (!user) {
            console.error("User not found or token malfunctioned for ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "User not registered OR Token Malfunctioned" });
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            console.error("Permissions mismatch for user ID:", user._id.toString(), "and token ID:", res.locals.jwtData.id);
            res.status(401).json({ message: "Permissions didn't match" });
            return;
        }
        res.clearCookie(constants_1.COOKIE_NAME, { path: "/", domain: "localhost", httpOnly: true, signed: true });
        console.log("User logged out successfully:", user.username);
        res.status(200).json({ message: "OK", username: user.username, email: user.email });
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
exports.userLogout = userLogout;
//# sourceMappingURL=user.controllers.js.map