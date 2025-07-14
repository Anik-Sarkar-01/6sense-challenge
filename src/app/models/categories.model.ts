import { model, Schema } from "mongoose";
import { ICategory } from "../interfaces/categories.interface";

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { versionKey: false, timestamps: true })

export const Category = model('Category', categorySchema);