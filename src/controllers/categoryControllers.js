import {prisma} from './../database/prisma.js';
import { z } from 'zod';

export const createCategory = async (req, res) => {
    const categoryCreateSchema = z.object({
        name: z.string().min(3),
        slug: z.string().min(3),
        description: z.string().optional(),
        imageUrl: z.url().optional(),
        parentId: z.uuid().optional()
    });
    const { success, data, error } = categoryCreateSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            status: 'Failure',
            message: 'Validation failed',
            error: z.flattenError(error)
        });
    }

    const newCategory = await prisma.category.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            imageUrl: data.imageUrl,
            parentId: data.parentId
        }
    });

    return res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        data: { category: newCategory }
    });
}

export const getAllCategories = async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json({
    status: 'success',
    message: 'Category fetched Successfully',
    data: { categories }
  });
};