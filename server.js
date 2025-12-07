import express from "express";
import {z} from "zod";
const app = express();

app.use(express.json());

app.get("/auth/sign-up", (req, res)=>{
    const userData = req.body;
    const createUserSchema = z.object({
        firstName : z.string().min(3),
        lastName : z.string().min(3),
        email : z.email(),
        password : z.string().min(5),
    })
    const {success, data, error} = createUserSchema.safeParse(userData);
    if(success){
        res.send(data);
    }else{
        res.send(z.prettifyError(error));
    }
})

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});