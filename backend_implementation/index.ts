import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userInterface from './src/services/userInput.ts'



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('Hello World!');
})

app.post('/ask', async (req,res)=>{
    const result = await userInterface(req.body.data);
    return res.status(200).json({ message: "Request processed successfully.", aiResponse: result });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

//[{role:user,message:text},....]