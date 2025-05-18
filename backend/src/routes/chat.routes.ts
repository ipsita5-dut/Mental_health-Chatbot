import { Router } from "express";
import { verifyToken } from "../utils/token.manager";
import { deleteChats, generateChatCompletion, sendChatToUser } from "../controllers/chat.controllers";
import { chatCompletionValidator, validate } from "../utils/validator";

//Protected API
const chatRoutes = Router();

// Define chat routes here
chatRoutes.post("/new", validate(chatCompletionValidator) ,verifyToken, generateChatCompletion );
// get all chats
chatRoutes.get("/all-chats",  verifyToken, sendChatToUser );
//route clear chat
chatRoutes.delete("/delete",  verifyToken, deleteChats );
// Export the chat router
export default chatRoutes;
