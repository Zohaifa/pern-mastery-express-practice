import express from "express";
import {json, z} from "zod";
import bcrypt from "bcrypt"
import {prisma} from "./prisma.js"
import jwt from "jsonwebtoken"
import authRoutes from './routes/authRouters.js'
import userRoutes from './routes/userRouters.js'

const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    return res.send("It works man!");
}); 

app.use("/user", userRoutes);
app.use("/auth", authRoutes)

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});