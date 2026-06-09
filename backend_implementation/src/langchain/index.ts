import * as z from "zod";
import {tool,createAgent} from "langchain"
import { InMemoryStore} from "@langchain/langgraph";
import "dotenv/config"
import readline from "readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const store = new InMemoryStore();

const getUserInfo = tool(
    async ({userID})=>{
        const value = await store.get(["users"],userID);
        // console.log("get_user_info",userID,value);
        return value;
    },
    {
        name: "get_user_info",
        description: "Look up for user info",
        schema: z.object({
            userID: z.string(),
        })
    }
);

const saveUserInfo = tool(
    async ({userID,name,age,email})=>{
        // console.log("save_user_info: ", userID,name,age,email);
        await store.put(["users"],userID,{name,age,email});
        return "Successfully saved user info";
    },
    {
        name:"save_user_info",
        description: "Save user info",
        schema: z.object({
            userID: z.string(),
            name: z.string(),
            age: z.number(),
            email: z.string()
        }),
    }
)



const agent = createAgent({
    model: "gpt-4o",
    tools: [saveUserInfo,getUserInfo],
    store,
})

const systemPrompt = "You are an assistant so remember the details of the users when the user enters it and answer them whenever they ask for it."

const messageContext: any[] = [];
messageContext.push({role:"system", content:systemPrompt});

while(true){
    const userInput: string = await new Promise((resolve) => {
        rl.question("Enter your prompt: ", (uinput: string) => {
            resolve(uinput);
        });
    });
    // console.log(userInput);
    if(userInput.toLowerCase() === "exit"){
        rl.close();
        process.exit(0)
    }
    else{
        messageContext.push({role:"user", content: userInput});
        const response = await agent.invoke({
            messages:messageContext
        })
        messageContext.push({role:"assistant", context: "..."});
        const finalMessage = response.messages[
            response.messages.length-1
        ];
        console.log(finalMessage?.content);
        // console.dir(response,{
        //     depth: null,
        //     colors: true
        // });
    }
    
}
    


// agent.invoke({
//     messages:[
//         {
//             role: "user",
//             content: "Save the following user: userId:Harshit@123, name: Harshit, age:22, email:harshit@gmail.com"
//         }
//     ]
// })


// const response = await agent.invoke({
//     messages:[
//         {
//             role:"user",
//             content: "Get user info for userId: Harshit@123"
//         }
//     ]
// })

// console.log(response)