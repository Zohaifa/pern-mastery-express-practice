import { prisma } from "../../database/prisma.js";
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
    if(!products){
        res.json({status: 'error', message: 'No products found'});
    }
    res.json({status: 'success', message: 'Products fetched succesffuly', data: products});
}

export const getProductById = async (req, res) => {
    const product = await prisma.product.findUnique({
        where: {
            id: req.params.id
        }
    });
    if(!product){
        return res.status(404).json({status: 'error', message: 'Product not found'});
    }
    res.json({status: 'success', message: 'Product fetched successfully', data: product});
}

export const updateProduct = async (req, res) => {
    const paramsSchema = z.object({
        id: z.uuid()
    });
    const {success: paramsSuccess, data: paramsData, error: paramsError} = paramsSchema.safeParse({id: req.params.id});
    if(!paramsSuccess){
        return res.status(400).json({status: 'error', message: 'Invalid product ID', error: z.flattenError(paramsError)});
    }
    const productSchema = z.object({
        title: z.string().min(3).optional(),
        slug: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        basePrice: z.number().positive().optional(),
        originalPrice: z.number().positive().optional(),
        stock_quantity: z.number().int().nonnegative().optional(),
        specifications: z.any().optional(),
        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
        categoryId: z.uuid().optional()
    });
    const {success: bodySuccess, data: bodyData, error: bodyError} = productSchema.safeParse(req.body);
    if(!bodySuccess){
        return res.status(400).json({status: 'error', message: 'Validation failed', error: z.flattenError(bodyError)});
    }
    const updatedProduct = await prisma.product.update({
        where: {
            id: req.params.id
        },
        data: bodyData
    });
    if(!updatedProduct){
        return res.status(500).json({status: 'error', message: 'Failed to update product'});
    }
    res.json({status: 'success', message: 'Product updated successfully', data: updatedProduct});
}  

export const deleteProduct = async (req, res) => {
    const paramsSchema = z.object({
        id: z.uuid()
    });
    const {success: paramsSuccess, data: paramsData, error: paramsError} = paramsSchema.safeParse({id: req.params.id});
    if(!paramsSuccess){
        return res.status(400).json({status: 'error', message: 'Invalid product ID', error: z.flattenError(paramsError)});
    }
    const deletedProduct = await prisma.product.delete({
        where: {
            id: req.params.id
        }
    });
    if(!deletedProduct){
        return res.status(500).json({status: 'error', message: 'Failed to delete product'});
    }
    res.json({status: 'success', message: 'Product deleted successfully', data: deletedProduct});
}


