import { z } from "zod";
import { prisma } from "./../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignIn = async (req, res) => {
  const userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(3),
  });

  const { success, data, error } = userLoginSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({
        status: "Failure",
        message: "Validation failed",
        error: z.flattenError(error),
      });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failure", message: "User not found" });
  }

  const passwordValidation = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordValidation) {
    return res
      .status(401)
      .json({ status: "Failure", message: "Email and Password doesn't match" });
  }

  const secret_key = process.env.SUPER_SECRET_KEY;
  const access_token = jwt.sign({ id: user.id }, secret_key, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .json({
      status: "success",
      message: "User signed in",
      data: { access_token },
    });
};

export const userSignUp = async (req, res) => {
    const userCreateSchema = z.object({
        firstName : z.string().min(3),
        lastName : z.string().min(3),
        email : z.string().email(),
        password : z.string().min(5),
    })
    
    const {success, data, error} = userCreateSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json({status: "fail", message: "validation failed", "error": z.flattenError(error)});
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

    return res.status(200).json({user: createdUser});
}

export const getUser = async (req, res) => {
    const user = req.user;
    if(!user){
            return res.status(404).json({status: "Failure", message: "User not found"});
        }
    return res.status(200).json({status: "Success", message: "User successfully fetched", "data": user});
}