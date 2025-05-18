import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI library
require('dotenv').config()

// Initialize the Generative AI instance with the secret key from the environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_SECRET);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
    systemInstruction: `You are an expert in the field of medical science, psychology and mental health improvement.
    You have an experience of 20 years of handling various clients suffering from numerous physical and mental diseases or problems and traumas.
    Act as a compassionate mental health proffesional. Provide empathetic responses to users seeking support, offering coping strategies, resources, and encouragement
    while ensuring a safe and non-judgemental space for sharing their feelings.`
 });

// Function to generate chat completion from a prompt
export const generateResult = async (inputPrompt: string): Promise<string> => {
    
        // Use the provided prompt or default to a predefined prompt
        const prompt = inputPrompt || "Explain how AI works";

        // Generate the result using the model
        const result = await model.generateContent(prompt);

        // Return the generated text response
        // console.log(result.response.text())
        
        return (result.response.text());
    
    
    
};
