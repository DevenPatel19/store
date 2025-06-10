import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import { connectDB } from './config/db.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at port ${PORT}  🦄🦄🦄🦄`);
    })

