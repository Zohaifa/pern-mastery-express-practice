import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  if (!users) {
    res.json({ error: "Couldn't perform the request" });
  }
  return res.status(200).json({
    status: "Success",
    message: "All users successfully fetched",
    data: users,
  });
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;
  const userIdSchema = z.object({
    id: z.uuid(),
  });
  const { success, error } = userIdSchema.safeParse({ id: userId });
  if (!success) {
    return res.status(400).json({
      status: "Failure",
      message: "Not a proper id",
      data: z.flattenError(error),
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failure", message: "User not found" });
  }
  return res
    .status(200)
    .json({ status: "Success", message: "User fetched", data: user });
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const userUpdateSchema = z.object({
    id: z.uuid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  const { success, data, error } = userUpdateSchema.safeParse({
    id: userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  if (!success) {
    return res.status(400).json({
      status: "Failed",
      message: "Validation failed",
      error: z.flattenError(error),
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      passwordHash: true,
    },
  });

  if (!user) {
    return res
      .status(404)
      .json({ status: "Failed", message: "user not found" });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
    omit: {
      passwordHash: true,
    },
  });

  return res.status(200).json({
    status: "Success",
    message: "user successfully updated",
    data: updatedUser,
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const userDeleteSchema = z.object({
    id: z.uuid(),
  });

  const { success, error } = userDeleteSchema.safeParse({
    id: userId,
  });

  if (!success) {
    return res
      .status(400)
      .json({
        status: "Failure",
        message: "Not a proper id",
        data: z.flattenError(error),
      });
  }

  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failure", message: "User not found" });
  }

  user = await prisma.user.delete({
    where: {
      id: userId,
    },
    omit: {
      passwordHash: true,
    },
  });
  return res
    .status(200)
    .json({
      status: "Success",
      message: "User successfully deleted",
      data: user,
    });
};
