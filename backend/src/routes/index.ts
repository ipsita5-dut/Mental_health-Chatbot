import { Router } from 'express';
import userRoutes from './user.routes';
import chatRoutes from './chat.routes';
const appRouter = Router();

// Define your routes here
appRouter.use("/user", userRoutes) //domain/api/v1/user
appRouter.use("/chat", chatRoutes) //domain/api/v1/chat
// Export the router
export default appRouter;
