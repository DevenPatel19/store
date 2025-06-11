import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUser = process.env.ATLAS_USER;
const dbPW = encodeURIComponent(process.env.ATLAS_PW); // Encode in case of special characters
const dbName = process.env.ATLAS_DB;
const cluster = process.env.ATLAS_CLUSTER;
const options = process.env.ATLAS_OPTIONS;

const uri = `mongodb+srv://${dbUser}:${dbPW}@${cluster}.mongodb.net/${dbName}?${options}`;

export const connectDB = async () => {
  try {
    // console.log(uri)   // Testing connection URI
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
