import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    // console.log(`MongoDB connected successfully to ${connectionInstance.connection.host}`);
    console.log(`MongoDB connected !! DB_HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
}

export default connectDB; 