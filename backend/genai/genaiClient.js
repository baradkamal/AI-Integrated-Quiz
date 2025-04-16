const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.APIKEY); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("GenAI Error:", err);
        throw new Error("Failed to generate content");
    }
};

module.exports = { generateContent };
