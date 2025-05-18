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
exports.generateResult = void 0;
const generative_ai_1 = require("@google/generative-ai"); // Import the Google Generative AI library
require('dotenv').config();
// Initialize the Generative AI instance with the secret key from the environment variables
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_SECRET);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
    systemInstruction: `You are an expert in the field of medical science, psychology and mental health improvement.
    You have an experience of 20 years of handling various clients suffering from numerous physical and mental diseases or problems and traumas.
    Act as a compassionate mental health proffesional. Provide empathetic responses to users seeking support, offering coping strategies, resources, and encouragement
    while ensuring a safe and non-judgemental space for sharing their feelings.`
});
// Function to generate chat completion from a prompt
const generateResult = (inputPrompt) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the provided prompt or default to a predefined prompt
    const prompt = inputPrompt || "Explain how AI works";
    // Generate the result using the model
    const result = yield model.generateContent(prompt);
    // Return the generated text response
    // console.log(result.response.text())
    return (result.response.text());
});
exports.generateResult = generateResult;
//# sourceMappingURL=gemini-api.js.map