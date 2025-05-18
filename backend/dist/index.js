"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./db/connection");
const dotenv_1 = require("dotenv");
// Load environment variables
(0, dotenv_1.config)();
const PORT = process.env.PORT || 5000;
// Log the MongoDB URL for debugging (optional, remove in production)
console.log('MongoDB URL:', process.env.MONGODB_URL);
(0, connection_1.connectToDatabase)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} and connected to the database.`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to the database:", err);
});
//# sourceMappingURL=index.js.map