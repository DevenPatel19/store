import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Get frontend from .env
const frontend = process.env.CORS_ORIGIN?.split(',') || [];

const app = express();

// ✅ CORS setup with dynamic origin check
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || frontend.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ✅ Allow cookies and auth headers
};


app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀🚀🚀🚀 Server started at port ${PORT}  🦄🦄🦄🦄`);
    })

