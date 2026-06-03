import getopenairesponse from '../apiServices/apiCall.ts';


async function askQuestion(req: any){

    const inputMessage = req;


//     const welcomeMessage = "Welcome to the OpenAI CLI! Type 'exit' to quit.";
// console.log(welcomeMessage);

// const message = [{role: "system", content: "You are a helpful assistant. Answer the user's questions to the best of your ability. If you don't know the answer, say you don't know. Be concise and clear in your responses. Also you will be given a conversation history, so use that to provide better answers. do not make up answers if you don't know the answer. Always be honest and helpful."}];


        // message.push({role: "user", content: userInput});
        try{
            
            const response = await getopenairesponse(inputMessage);
            console.log(response)
            inputMessage.push({"role":"assistant","response ":response});
            // message.push({role: "assistant", content: response});
            // console.log("Response:", response);
            console.log("input message: ", JSON.stringify(inputMessage,null,2));
            return inputMessage;
        }
        catch(error){
            console.error("Error:", error);
        }

}


// function askQuestion(){
//     rl.question("Enter your question:",async (prompt: string)=>{
//         try{
//             const response = await getopenairesponse(prompt);
//             console.log("OpenAI Response:", response);
//             return response;
//         }catch (error) {
//             console.error("Error:", error);
//             throw error;
//         }
//     })
// };

export default askQuestion;
