import { RequestHandler } from "express";
import { User } from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token.manager";
import { COOKIE_NAME } from "../utils/constants";

export const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "OK", users });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};

export const userSignup: RequestHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(401).json({ message: "User already registered" });
            return;
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        //create token nd store cookie
        res.clearCookie(COOKIE_NAME, 
            {path: "/", domain: "localhost", httpOnly: true, signed: true}
        )

        const token= createToken(user._id.toString(), user.email,"7d")
        const expires= new Date();
        expires.setDate(expires.getDate()+7)
        res.cookie(COOKIE_NAME, token, 
            {path: "/", domain: "localhost", expires, httpOnly: true, signed: true})


        res.status(201).json({ message: "OK", username: user.username, email: user.email });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};

export const userLogin: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            res.status(401).json({ message: "User not registered" });
            return;
        }
        const isPasswordCorrect = await compare(password, user.password)
        if(!isPasswordCorrect){
             res.status(403).send("incorrect password")
             return;
        }

         //create token nd store cookie

        res.clearCookie(COOKIE_NAME, 
            {path: "/", domain: "localhost", httpOnly: true, signed: true}
        )

        const token= createToken(user._id.toString(), user.email,"7d")
        const expires= new Date();
        expires.setDate(expires.getDate()+7)
        res.cookie(COOKIE_NAME, token, 
            {path: "/", domain: "localhost", expires, httpOnly: true, signed: true})

        res.status(200).json({ message: "OK", username: user.username, email: user.email });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};

export const verifyUser: RequestHandler = async (req, res): Promise<void> => {
    try {
        console.log("Attempting to verify user with ID:", res.locals.jwtData.id);
        const user = await User.findById(res.locals.jwtData.id);
        
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
    } catch (error: unknown) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};


export const userLogout: RequestHandler = async (req, res): Promise<void> => {
    try {
        console.log("Attempting to verify user with ID:", res.locals.jwtData.id);
        const user = await User.findById(res.locals.jwtData.id);
        
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
        
        res.clearCookie(COOKIE_NAME, 
            {path: "/", domain: "localhost", httpOnly: true, signed: true}
        )

        console.log("User logged out successfully:", user.username);
        res.status(200).json({ message: "OK", username: user.username, email: user.email });
    } catch (error: unknown) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};