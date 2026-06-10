import mongoose from "mongoose";
import { setServers } from "node:dns";

setServers(["1.1.1.1","8.8.8.8"])

export const connectDb = async()=>{
    try{
        // console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI!);
        // console.log("MongoDb Connected");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}