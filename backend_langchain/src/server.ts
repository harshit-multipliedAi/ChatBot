import app from "./app.ts"
import { connectDb } from "./db/mongo.ts";
import "dotenv/config"

const PORT = process.env.PORT ||3000;


connectDb().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});
})