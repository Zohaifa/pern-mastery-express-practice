import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const createProduct = async (req, res) => {
    const productSchema = z.object({
        title: z.string().min(3),
        slug: z.string().min(3),
        description: z.string().min(10),
        basePrice: z.number().positive(),
        originalPrice: z.number().positive().optional(),
        stock_quantity: z.number().int().nonnegative(),
        specifications: z.any(),
        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
        categoryId: z.uuid()
    });
    const {success, data, error} = productSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({status: 'success', message: error});
    }
    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId
        }
    }); 

    if(!category){
        return res.status(404).json({status: 'error', message: 'Category not found'});
    }

    const newProduct = await prisma.product.create({
        data: {
            title: data.title,
            slug: data.slug,
            description: data.description,
            basePrice: data.basePrice,
            originalPrice: data.originalPrice,
            stock_quantity: data.stock_quantity,
            specifications: data.specifications,
            isFeatured: data.isFeatured ?? false,
            isActive: data.isActive ?? true,
            categoryId: category.id
        }
    });
    
    if(!newProduct){
        return res.status(500).json({status: 'error', message: 'Failed to create product'});
    }

    res.status(201).json({status: 'success', message: 'Product created successfully' , data: newProduct});
}

export const getAllProducts = async (req, res) => {
    const products = await prisma.product.findMany();
}

export const getProductById = async (req, res) => {
    return res.send("Get product by ID");
}

export const updateProduct = async (req, res) => {
    return res.send("Update product");
}

export const deleteProduct = async (req, res) => {
    return res.send("Delete product");
}
