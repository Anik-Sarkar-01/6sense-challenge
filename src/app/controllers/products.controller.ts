import express, { Request, Response } from "express";
import { Category } from "../models/categories.model";
import { Product } from "../models/products.model";
export const productRoutes = express.Router();

productRoutes.post('/', async (req: Request, res: Response) => {

    let { category: categoryName, ...rest } = req.body;

    const existingCategory = await Category.findOne({ name: categoryName });

    if (!existingCategory) {
        return res.status(400).json({
            success: false,
            message: 'Category not found'
        });
    }

    const category = existingCategory._id;

    const productData = {
        ...rest,
        category
    }

    const product = await Product.create(productData);

    res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        product
    })
})

productRoutes.patch('/:productId', async (req: Request, res: Response) => {
    const id = req.params.productId;
    const { description, discount, status } = req.body;

    const updatedBody = {
        description,
        discount,
        status
    }

    const product = await Product.findByIdAndUpdate(id, updatedBody, { runValidators: true, new: true });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.status(200).json({
        success: true,
        message: "Update Successfully",
        product
    })
})

productRoutes.get('/', async (req: Request, res: Response) => {
    const { filter, search } = req.query;
    const query: any = {};

    if (filter) {
        const categoryDoc = await Category.findOne({ name: filter });
        if (!categoryDoc) {
            return res.status(404).json({ message: "Category not found" });
        }
        query.category = categoryDoc._id;
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);

    const finalProduct = products.map(product => {
        const finalPrice = parseFloat((product.price - (product.price * product.discount / 100)).toFixed(2));

        return {
            description: product.description,
            image: product.image,
            status: product.status,
            price: product.price,
            discount: product.discount,
            finalPrice: finalPrice,
            category: product.category,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }

    });

    res.status(200).json({
        success: true,
        count: finalProduct.length,
        finalProduct,
    });
});

