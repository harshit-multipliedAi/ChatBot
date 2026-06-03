const OpenAi = require("openai");

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateResponse = async (prompt)=>{
    try{
        const response = await openai.responses.create({
            model: "gpt-5.5",
            input: prompt,
        });
        // console.log("OpenAI Response:", response.output_text);
        return response;
    }catch(error){
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response");
    }
}

module.exports = {
    generateResponse,
}