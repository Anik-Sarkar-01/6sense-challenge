import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { versionKey: false, timestamps: true })

export const Category = model('Category', categorySchema);