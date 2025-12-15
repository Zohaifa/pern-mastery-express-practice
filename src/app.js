import express from "express";
import {z} from "zod";
import bcrypt from "bcrypt"
import {prisma} from "./prisma.js"

const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("It works man!");
});

app.post("/auth/sign-up", async (req, res)=>{
    const userCreateSchema = z.object({
        firstName : z.string().min(3),
        lastName : z.string().min(3),
        email : z.email(),
        password : z.string().min(5),
    })
    
    const {success, data, error} = userCreateSchema.safeParse(req.body);

    if(!success){
        res.status(400).json({status: "fail", message: "validation failed", "error": z.flattenError(error)});
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 5);
    
    const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: hashedPassword
    }

    const createdUser = await prisma.user.create({
        data: user
    });

    res.status(200).json({user: createdUser});
});

app.post("/auth/sign-in", async (req, res)=>{
    const userLoginSchema = z.object({
        email: z.email(),
        password: z.string().min(3)
    })
    
    const {success, data, error} = userLoginSchema.safeParse(req.body);
    
    if(!success){
        res.status(400).json({status: "Failure", message: "Validation failed", "error": z.flattenError(error)});
    }

    const user = await prisma.user.findUnique({
        where:{
            email: data.email
        },
    })
    if(!user){
        res.status(404).json({status: "Failure", message: "User not found"});
    }

    const passwordValidation = await bcrypt.compare(data.password, user.passwordHash);

    if(!passwordValidation){
        res.status(401).json({status: "Failure", message: "Email and Password doesn't match"});
    }

    res.status(200).json({status: "success", message: "User retrieved", data: user});
});

app.get("/user/get", async (req, res)=>{
    const users = await prisma.user.findMany();
    if(!users){
        res.json({error: "Couldn't perform the request"});
    }
    res.status(200).json({status: "Success", message: "All users successfully fetched", data: users});
});


app.delete("/user/delete/:id", async (req, res)=>{
    const userId = req.params.id;
     const userDeleteSchema = z.object({
        id: z.uuid(),
    });

    const { success, error } = userDeleteSchema.safeParse({
        id: userId,
    });

    if (!success) {
        return res.status(400).json({ message: 'Validation failed', data: z.flattenError(error) });
    }

    let user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    })
    if(!user){
        res.status(404).json({status: "Failure", message: "User not found"});
    }
    
    user = await prisma.user.delete({
        where:{
            id: userId
        },
        omit:{
            passwordHash: true
        }
    });
    res.status(200).json({status: "Success", message: "User successfully deleted", data: user});
});

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});