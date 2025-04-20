import mongoose from "mongoose";
import { Db_Name } from './../constants.js';

const connectDB = async() => {
    return new Promise(async(resolve, reject) => {
        try{
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${Db_Name}`);
            console.log(`\n Mongo DB Connected !! DB HOST: ${connectionInstance.connection.host}`);
            resolve();
    
        }catch (error){
            console.error("MONGODB Connection FAILED: ", error);
            reject();
            process.exit(1);
        }
    })
}

//for local connection
// const connectDB = async() => {
//     try{
//         mongoose.connect(process.env.URI);
//     } catch(err) {
//         console.error(err);
        
//     }
// }

export { connectDB }