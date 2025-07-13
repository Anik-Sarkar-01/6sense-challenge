import express, { Application, Request, Response } from 'express';
import mongoose, { model, Schema } from 'mongoose';

const app: Application = express();
app.use(express.json())


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { versionKey: false, timestamps: true })

const Category = model('Category', categorySchema);

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: "",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Price should be at least 1, got {VALUE}']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot be more than 100%']
    },
    image: {
        type: String,
        required: [true, 'Provide valid image URL']
    },
    status: {
        type: String,
        enum: {
            values: ['In Stock', 'Stock Out'],
            message: '{VALUE} is not accepted, must be In Stock or Stock Out'
        },
        default: 'In Stock',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    }
}, { versionKey: false, timestamps: true });


const Product = model('Product', productSchema);

app.post('/categories/create-category', async (req: Request, res: Response) => {
    const body = req.body;
    const category = await Category.create(body);

    res.status(201).json({
        success: true,
        message: "Category Created Successfully",
        category
    })
})

app.post('/products/create-product', async (req: Request, res: Response) => {

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

app.patch('/products/:productId', async (req: Request, res: Response) => {
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

app.get('/products', async (req: Request, res: Response) => {
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

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to 6sense challenge app');
})

export default app;