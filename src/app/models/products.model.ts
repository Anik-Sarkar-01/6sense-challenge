import mongoose, { model, Schema } from "mongoose";

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

export const Product = model('Product', productSchema);