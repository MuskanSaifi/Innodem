import mongoose from "mongoose";

const connectdb  = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database Connect Successfull ${conn.connection.host}`.bgGreen)
    } catch (error) {
       console.log(`Database connection failed ${error}`.bgRed) 
    }
};

export default connectdb;