import { prisma } from "./../database/prisma.js";
import { z } from "zod";

export const createCategory = async (req, res) => {
  const categoryCreateSchema = z.object({
    name: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().optional(),
    imageUrl: z.url().optional(),
    parentId: z.uuid().optional(),
  });
  const { success, data, error } = categoryCreateSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      status: "Failure",
      message: "Validation failed",
      error: z.flattenError(error),
    });
  }

  const newCategory = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: { category: newCategory },
  });
};

export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json({
    status: "success",
    message: "Category fetched Successfully",
    data: { categories },
  });
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const categorySchema = z.object({
    id: z.uuid(),
  });

  const { success, data, error } = categorySchema.safeParse({ id: categoryId });

  if (!success) {
    res.status(400).json({
      status: "error",
      message: "Bad request",
    });
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({
      status: "Failure",
      message: "Category not found",
    });
  }

  return res.json({
    status: "success",
    message: "Category fetched successfully",
    data: { category },
  });
};

export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categorySchema = z.object({
    id: z.uuid(),
  });
  const {
    success: paramSuccess,
    data: paramData,
    error: paramError,
  } = categorySchema.safeParse({ id: categoryId });
  if (!paramSuccess) {
    res
      .status(400)
      .json({ status: "fail", message: "not a valid id", error: paramError });
  }
  const updateCategorySchema = z.object({
    name: z.string().min(3),
    slug: z.string().min(3).optional(),
    description: z.string().optional(),
    imageUrl: z.url().optional(),
    parentId: z.uuid().optional(),
  });

  const {
    success: bodySuccess,
    data: bodyData,
    error: bodyError,
  } = updateCategorySchema.safeParse(req.body);

  if (!bodySuccess) {
    res.status(400).json({
      status: "error",
      message: "Give proper inputs",
      error: z.flattenError(bodyError),
    });
  }
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: bodyData,
  });

  res.json({
    status: "success",
    message: "Category updated Successfully",
    data: { category: updatedCategory },
  });
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categoryIdSchema = z.object({
    id: z.uuid(),
  });
  const {
    success: idSuccess,
    data: idData,
    error: idError,
  } = categoryIdSchema.safeParse({ id: categoryId });
  if (!idSuccess) {
    res
      .status(400)
      .json({ status: "fail", message: "not a valid id", error: idError });
  }
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return res.status(404).json({
      status: "Failure",
      message: "Category not found",
    });
  }

  const deletedCategory = await prisma.category.delete({
    where: { id: categoryId },
  });
  if (!deletedCategory) {
    res.status(400).json({ status: "fail", message: "Category not found" });
  }
  return res.json({
    status: "success",
    message: "category successfully deleted",
    data: deletedCategory,
  });
};
