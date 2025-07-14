"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./app/controllers/products.controller");
const categories_controller_1 = require("./app/controllers/categories.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/products", products_controller_1.productRoutes);
app.use("/api/categories", categories_controller_1.categoryRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to 6sense challenge app');
});
exports.default = app;
