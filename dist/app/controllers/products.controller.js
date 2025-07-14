"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categories_model_1 = require("../models/categories.model");
const products_model_1 = require("../models/products.model");
exports.productRoutes = express_1.default.Router();
exports.productRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let _a = req.body, { category: categoryName } = _a, rest = __rest(_a, ["category"]);
    const existingCategory = yield categories_model_1.Category.findOne({ name: categoryName });
    if (!existingCategory) {
        return res.status(400).json({
            success: false,
            message: 'Category not found'
        });
    }
    const category = existingCategory._id;
    const productData = Object.assign(Object.assign({}, rest), { category });
    const product = yield products_model_1.Product.create(productData);
    res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        product
    });
}));
exports.productRoutes.patch('/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.productId;
    const { description, discount, status } = req.body;
    const updatedBody = {
        description,
        discount,
        status
    };
    const product = yield products_model_1.Product.findByIdAndUpdate(id, updatedBody, { runValidators: true, new: true });
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
    });
}));
exports.productRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, search } = req.query;
    const products = yield products_model_1.Product.getFilteredProducts({
        filter: filter,
        search: search,
    });
    res.status(200).json({
        success: true,
        count: products.length,
        finalProduct: products,
    });
}));
