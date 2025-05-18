import { connect } from "mongoose";
import { disconnect } from "process";

  async function connectToDatabase() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        await connect(process.env.MONGODB_URL);
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

async function disconnectToDatabase() {
    try {
        await disconnect();
    } catch (error) {
        console.error('Error during disconnection from MongoDB:', error);
        throw new Error("Couldn't disconnect from MongoDB");
    }
}

export {connectToDatabase, disconnectToDatabase}