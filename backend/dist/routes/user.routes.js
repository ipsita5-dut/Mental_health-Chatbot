"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const validator_1 = require("../utils/validator");
const token_manager_1 = require("../utils/token.manager");
const userRoutes = (0, express_1.Router)();
// Define user routes here
userRoutes.get("/", user_controllers_1.getAllUsers);
userRoutes.post('/signup', (0, validator_1.validate)(validator_1.signupValidator), user_controllers_1.userSignup);
userRoutes.post('/login', (0, validator_1.validate)(validator_1.loginValidator), user_controllers_1.userLogin);
userRoutes.get("/auth-status", token_manager_1.verifyToken, user_controllers_1.verifyUser);
userRoutes.get('/logout', token_manager_1.verifyToken, user_controllers_1.userLogout);
// Export the user router
exports.default = userRoutes;
//# sourceMappingURL=user.routes.js.map