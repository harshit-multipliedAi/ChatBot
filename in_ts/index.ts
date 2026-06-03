import "dotenv/config";
import helperFunction from "./services/helperFunction.ts";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,     
})

const welcomeMessage = "Welcome to the OpenAI CLI! Type 'exit' to quit.";
console.log(welcomeMessage);

const message = [{role: "system", content: "You are a helpful assistant. Answer the user's questions to the best of your ability. If you don't know the answer, say you don't know. Be concise and clear in your responses. Also you will be given a conversation history, so use that to provide better answers. do not make up answers if you don't know the answer. Always be honest and helpful."}];

while(true){
    const userInput: string = await new Promise((resolve) => {
        rl.question("Enter your prompt: ", (uinput: string) => {
            resolve(uinput);
        });
    });

    if (userInput.toLowerCase() === "exit") {
        console.log("Exiting the OpenAI CLI. Goodbye!");
        rl.close();
        process.exit(0);
    }
    else{
        message.push({role: "user", content: userInput});
        try{
            const response = await helperFunction(message);
            message.push({role: "assistant", content: response});
            console.log("Response:", response);
        }
        catch(error){
            console.error("Error:", error);
        }
    }
};


    // rl.question("Enter your prompt:", async (prompt: string)=>{

    //     try{
    //         const response = await helperFunction(message);
    //         // console.log("Response:", response?.output_text);
    //         console.log("Response:", response);
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    //     rl.close();
    // })




// const pormpt = "what is the capital of india?";




// helperFunction(pormpt)
//     .then((response)=>{
//         console.log("Response:", response.output_text);
//     })
//     .catch((error)=>{
//         console.error("Error:", error);
//     });