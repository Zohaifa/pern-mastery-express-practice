import { prisma } from "../../database/prisma.js";
import { z } from "zod";


export const getAllVariant = async (req, res) =>{
  const variants =  await prisma.productVariants.findMany();

  res.json({
    status: 'success',
    message: 'All product variants fetched successfully',
    data: variants
  })
}

export const getVariantById = async (req, res) => {
  const variantId = req.params.id;

  const schema = z.object({
    id: z.uuid()
  });

  const { success, data, error } = schema.safeParse({ id: variantId });

  if (!success){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: Invalid UUID format',
    });
  }

  const variant = await prisma.productVariants.findUnique({
    where: { id: variantId }
  });

  if (!variant) {
    return res.status(404).json({
      status: 'error',
      message: 'Variant not found',
    });
  }

  res.json({
    status: 'success',
    message: 'Product variant fetched successfully',
    data: variant
  });
}


export const createVariant = async (req, res) => {
  const { productId, variantName, variantValue, priceAdjustment, stockQuantity, imageUrl } = req.body;

  const createSchema = z.object({
    productId: z.uuid(),
    variantName: z.string().max(50),
    variantValue: z.string().max(50),
    priceAdjustment: z.number().optional().default(0.00),
    stockQuantity: z.number().int().nonnegative().optional().default(0),
    imageUrl: z.url().optional()
  });

  const { success, data, error } = createSchema.safeParse({ productId, variantName, variantValue, priceAdjustment, stockQuantity, imageUrl });

  if (!success){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: ',
      error: error
    });
  }

  const newVariant = await prisma.productVariants.create({
    data: {
      productId: data.productId,
      variantName: data.variantName,
      variantValue: data.variantValue,
      priceAdjustment: data.priceAdjustment,
      stockQuantity: data.stockQuantity,
      imageUrl: data.imageUrl
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Product variant created successfully',
    data: newVariant
  });
}

export const updateVariant = async (req, res) => {
  const variantId = req.params.id;

  const paramSchema = z.object({
    id: z.uuid()
  });

  const { success : paramSuccess, data: paramData, error: paramError } = paramSchema.safeParse({ id: variantId });

  if (!paramSuccess){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: Invalid UUID format',
      data: paramError
    });
  }

  const variant = await prisma.productVariants.findUnique({
    where: { id: variantId }
  });

  if (!variant) {
    return res.status(404).json({
      status: 'error',
      message: 'Variant not found',
    });
  }
  const updateSchema = z.object({
    productId: z.uuid().optional(),
    variantName: z.string().max(50).optional(),
    variantValue: z.string().max(50).optional(),
    priceAdjustment: z.number().optional().default(0.00).optional(),
    stockQuantity: z.number().int().nonnegative().optional().default(0).optional(),
    imageUrl: z.url().optional()
  });

  const { success, data, error } = updateSchema.safeParse(req.body);

  if (!success){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: ',
      error: error
    });
  }
  const updatedVariant = await prisma.productVariants.update({
    where: { id: variantId },
    data: data
  })
  if(!updatedVariant){
    return res.status(400).json({
      status: 'error',
      message: 'Variant couldn\'t be updated'
    });
  }
  res.status(201).json({
    status: 'success',
    message: 'Product variant updated successfully',
    data: updatedVariant
  });
}

export const deleteVariant = async (req, res) => {
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
  const deletedVariant = await prisma.productVariants.delete({
    where: paramData,
  });
  if (!deletedVariant) {
    return res
      .status(404)
      .json({ status: "error", message: "failed to delete product variant" });
  }
  res
    .status(200)
    .json({
      status: "success",
      message: "product image successfully variant",
      data: deletedVariant,
    });
};
