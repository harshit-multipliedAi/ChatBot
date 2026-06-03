import openai from 'openai';

const openaiClient = new openai({
    apiKey: process.env.OPENAI_API_KEY,
});


export default async function getOpenAIResponse(prompt: any){
    try{
        console.log("prompt: " ,prompt)
        const response = await openaiClient.responses.create({
            model: "gpt-4.1",
            input: prompt,
        })
        console.log("Result of the ai: ",response);
        return response.output_text;
    }catch (error) {
        console.error("Error:", error);
        throw error;
    }
}