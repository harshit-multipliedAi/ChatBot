require('dotenv').config();
const readline = require('readline');
const helperFunction = require('./services/helperFunction');

// const prompt = "What is the capital of India?";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your prompt: ", (userPrompt) => {
    const prompt = userPrompt?.trim();
    helperFunction.generateResponse(prompt).then(response =>{
        // console.log("Full Response from OpenAI:", response);
        console.log("Response from OpenAI:", response?.output_text);
    }).catch(error => {
        console.error("Error:", error);
    });
    rl.close();
});


// helperFunction.generateResponse(prompt).then(response => {
//     console.log("Response from OpenAI:", response?.output_text);
// }).catch(error => {
//     console.error("Error:", error);
// });