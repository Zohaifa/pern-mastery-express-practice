import express from "express";
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