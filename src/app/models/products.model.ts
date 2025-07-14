import mongoose, { model, Schema } from "mongoose";
import { IProduct, ProductStaticMethod } from "../interfaces/products.interface";
import { Category } from "./categories.model";
import crypto from 'crypto';

const productSchema = new Schema<IProduct, ProductStaticMethod>({
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
    productCode: {
        type: String,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    }
}, { versionKey: false, timestamps: true });


// static method implementation
productSchema.statics.getFilteredProducts = async function ({
    filter,
    search,
}: {
    filter?: string;
    search?: string;
}) {
    const query: any = {};

    if (filter) {
        const categoryDoc = await Category.findOne({ name: filter });
        if (!categoryDoc) {
            throw new Error('Category not found');
        }
        query.category = categoryDoc._id;
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const products = await this.find(query).populate('category');

    return products.map(product => {
        const finalPrice = parseFloat(
            (product.price - (product.price * product.discount) / 100).toFixed(2)
        );

        return {
            description: product.description,
            image: product.image,
            status: product.status,
            price: product.price,
            discount: product.discount,
            finalPrice,
            category: product.category,
        };
    });
};

// product code generation using pre hook
productSchema.pre<IProduct>('save', function (next) {
    const name = this.name;
    const compact = name.toLowerCase().split(' ').join('');
    const letters = compact.split('');

    let result: { value: string; start: number; end: number }[] = [];
    let maxLen = 0;
    let start = 0;

    for (let i = 1; i <= letters.length; i++) {
        if (i === letters.length || letters[i] <= letters[i - 1]) {
            const len = i - start;
            const substring = compact.slice(start, i);

            if (len > maxLen) {
                maxLen = len;
                result = [{ value: substring, start, end: i - 1 }];
            } else if (len === maxLen) {
                result.push({ value: substring, start, end: i - 1 });
            }

            start = i;
        }
    }

    const merged = result.map(r => r.value).join('');
    const firstStart = result[0].start;
    const lastEnd = result[result.length - 1].end;

    const hash = crypto.createHash('sha256').update(name).digest('hex').slice(0, 7);

    this.productCode = `${hash}-${firstStart}${merged}${lastEnd}`;

    next();
});


export const Product = model<IProduct, ProductStaticMethod>('Product', productSchema);