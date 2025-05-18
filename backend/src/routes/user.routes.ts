import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user.controllers";
import { loginValidator, signupValidator,validate } from "../utils/validator";
import { verifyToken } from "../utils/token.manager";

const userRoutes = Router();


// Define user routes here
userRoutes.get("/", getAllUsers);
userRoutes.post('/signup',validate(signupValidator),userSignup)
userRoutes.post('/login', validate(loginValidator), userLogin)
userRoutes.get("/auth-status",verifyToken ,verifyUser)
userRoutes.get('/logout',verifyToken ,userLogout)
// Export the user router
export default userRoutes;
