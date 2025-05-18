import { Request, RequestHandler, Response } from "express";
import { generateResult } from "../config/gemini-api";
import { User } from "../models/User";

// Function to generate chat completion
export const generateChatCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
        // Destructure the message from the request body
        const { message } = req.body;

        // Validate if message is provided
        if (!message) {
             res.status(400).json({ message: "Prompt (message) is required" });
             return;
        }

        // Retrieve the user based on the JWT token data stored in res.locals
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
         res.status(401).json({ message: "User not registered or token malfunctioned" });
         return;
        }

        // Fetch the user's previous chats (if any) for context
        const previousChats = user.chats.map(chat => chat.content).join("\n"); // Joining previous chats for context

        // Combine the previous chats with the new message to send to the Gemini API
        const fullPrompt = previousChats + "\n" + message; // Combining previous chats with the new message

        // Call the generateResult function to get the response from Gemini AI
        const result = await generateResult(fullPrompt);

        // Save the new chat message to the user's history (both user and bot responses)
        user.chats.push({ content: message });
        user.chats.push({ content: result }); // Save the AI's response
        await user.save();

        // Send the generated result as a response
        res.status(200).json({
            message: "Success",
            response: result, // Response from Gemini AI
            chatHistory: user.chats // Return the updated chat history
        });
    } catch (error: unknown) {
        // Enhanced error handling for different error types
        if (error instanceof Error) {
            console.error("Error generating chat completion:", error);
            res.status(500).json({ message: "Failed to generate chat completion", error: error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Failed to generate chat completion", error: "Unknown error" });
        }
    }
};


export const sendChatToUser: RequestHandler = async (req, res): Promise<void> => {
    try {
        console.log("Attempting to verify user with ID(in chat-controllers):", res.locals.jwtData.id);
        const user = await User.findById(res.locals.jwtData.id);
        
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
    } catch (error: unknown) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};


export const deleteChats: RequestHandler = async (req, res): Promise<void> => {
    try {
        console.log("Attempting to verify user with ID(in chat-controllers(deletechats)):", res.locals.jwtData.id);
        const user = await User.findById(res.locals.jwtData.id);
        
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
        user.chats=[];
        await user.save();
        res.status(200).json({ message: "OK", });
    } catch (error: unknown) {
        console.error("Error occurred during user verification:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: "ERROR", cause: error.message });
        } else {
            res.status(500).json({ message: "ERROR", cause: "Unknown error occurred" });
        }
    }
};


