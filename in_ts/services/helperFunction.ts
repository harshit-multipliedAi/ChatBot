import OpenAi from "openai";


// console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function helperFunction(prompt: any)
{
    try{
        const response = await openai.responses.create({
            model: "gpt-4.1",
            input: prompt,
        });
        return response.output_text;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
