import express from "express";
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRouters.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/products/index.js'
import cartRoutes from './routes/cartRoutes.js'


const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    return res.send("It works man!");
}); 

app.use("/user", userRoutes);
app.use("/auth", authRoutes)
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes)

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});