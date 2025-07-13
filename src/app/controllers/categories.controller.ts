import express, { Request, Response } from "express";
import { Category } from "../models/categories.model";
export const categoryRoutes = express.Router();

categoryRoutes.post('/', async (req: Request, res: Response) => {
    const body = req.body;
    const category = await Category.create(body);

    res.status(201).json({
        success: true,
        message: "Category Created Successfully",
        category
    })
})