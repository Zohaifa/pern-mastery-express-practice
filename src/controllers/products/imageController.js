import { prisma } from "../../database/prisma.js";
import { z } from "zod";
import { updateProduct } from "./productController.js";

export const getAllImages = async (req, res) => {
  const images = await prisma.productImages.findMany();
  if (!images) {
    res.json({ status: "fail", message: "failed to fetch images" });
  }
  res.json({
    status: "success",
    message: "Images fetched successfully",
    data: images,
  });
};

export const getImageById = async (req, res) => {
  const imageId = req.params.id;

  const imageSchema = z.object({
    id: z.uuid(),
  });

  const { success, data, error } = imageSchema.safeParse({ id: imageId });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Bad request: Invalid UUID format",
    });
  }

  const image = await prisma.productImages.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return res.status(404).json({
      status: "error",
      message: "Image not found",
    });
  }

  res.json({
    status: "success",
    message: "Product image fetched successfully",
    data: image,
  });
};

export const createImage = async (req, res) => {
  const { productId, imageUrl, altText, displayOrder, isPrimary } = req.body;

  const createSchema = z.object({
    productId: z.uuid(),
    imageUrl: z.url(),
    altText: z.string().max(255).optional(),
    displayOrder: z.number().int().nonnegative().optional(),
    isPrimary: z.boolean().optional(),
  });

  const { success, data, error } = createSchema.safeParse({
    productId,
    imageUrl,
    altText,
    displayOrder,
    isPrimary,
  });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Bad request payload must have valid productId and imageUrl",
      error: error,
    });
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found for the given productId",
    });
  }

  const newImage = await prisma.productImages.create({
    data: {
      productId: data.productId,
      imageUrl: data.imageUrl,
      altText: data.altText,
      displayOrder: data.displayOrder ?? 0,
      isPrimary: data.isPrimary ?? false,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Product image created successfully",
    data: newImage,
  });
};

export const updateImage = async (req, res) => {
  const paramSchema = z.object({ id: z.uuid() });
  const {
    success: paramSuccess,
    data: paramData,
    error: paramError,
  } = paramSchema.safeParse({
    id: req.params.id,
  });
  if (!paramSuccess) {
    return res.status(400).json({
      status: "error",
      message: "not a valid uuid",
      error: paramError,
    });
  }
  const imageSchema = z.object({
    productId: z.uuid().optional(),
    imageUrl: z.url().optional(),
    altText: z.string().max(255).optional(),
    displayOrder: z.number().int().nonnegative().optional(),
    isPrimary: z.boolean().optional(),
  });
  const { success, data, error } = imageSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Bad request payload must have valid productId and imageUrl",
      error: error,
    });
  }
  const image = await prisma.productImages.findUnique({
    where: paramData,
  });
  if (!image) {
    return res
      .status(404)
      .json({ status: "error", message: "product image not found" });
  }
  const updatedImage = await prisma.productImages.update({
    where: paramData,
    data: data,
  });
  if (!updatedImage) {
    return res
      .status(404)
      .json({ status: "error", message: "failed to update product image" });
  }
  return res.status(200).json({
    status: "success",
    message: "product image successfully update",
    data: updatedImage,
  });
};

export const deleteImage = async (req, res) => {
  const paramSchema = z.object({ id: z.uuid() });
  const {
    success: paramSuccess,
    data: paramData,
    error: paramError,
  } = paramSchema.safeParse({
    id: req.params.id,
  });
  if (!paramSuccess) {
    return res.status(400).json({
      status: "error",
      message: "not a valid uuid",
      error: paramError,
    });
  }
  const deletedImage = await prisma.productImages.delete({
    where: paramData,
  });
  if (!deletedImage) {
    return res
      .status(404)
      .json({ status: "error", message: "failed to delete product image" });
  }
  res
    .status(200)
    .json({
      status: "success",
      message: "product image successfully update",
      data: deletedImage,
    });
};
