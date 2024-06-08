import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongodb Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
