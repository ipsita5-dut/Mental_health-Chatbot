import app from "./app";
import { connectToDatabase } from "./db/connection";
import { config } from "dotenv";

// Load environment variables
config();

const PORT = process.env.PORT || 5000;

// Log the MongoDB URL for debugging (optional, remove in production)
console.log('MongoDB URL:', process.env.MONGODB_URL);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} and connected to the database.`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
