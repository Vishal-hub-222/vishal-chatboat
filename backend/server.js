import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import cors from "cors"

const app =express();
dotenv.config();
app.use(cors());
const PORT=process.env.PORT ||8080;

import chatRoutes from "./routes/ChatRoutes.js";


app.use(express.json());

app.use("/api", chatRoutes);


app.listen(PORT,()=>{
    console.log("server is runing on port no 3000...");
    connectDB();
})