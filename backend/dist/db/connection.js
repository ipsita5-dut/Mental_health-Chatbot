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
exports.connectToDatabase = connectToDatabase;
exports.disconnectToDatabase = disconnectToDatabase;
const mongoose_1 = require("mongoose");
const process_1 = require("process");
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.MONGODB_URL) {
                throw new Error('MONGODB_URL is not defined in environment variables');
            }
            yield (0, mongoose_1.connect)(process.env.MONGODB_URL);
        }
        catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    });
}
function disconnectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, process_1.disconnect)();
        }
        catch (error) {
            console.error('Error during disconnection from MongoDB:', error);
            throw new Error("Couldn't disconnect from MongoDB");
        }
    });
}
//# sourceMappingURL=connection.js.map