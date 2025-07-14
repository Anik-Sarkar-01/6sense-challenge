"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const categories_model_1 = require("./categories.model");
const crypto_1 = __importDefault(require("crypto"));
const productSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    }
}, { versionKey: false, timestamps: true });
// static method implementation
productSchema.statics.getFilteredProducts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, search, }) {
        const query = {};
        if (filter) {
            const categoryDoc = yield categories_model_1.Category.findOne({ name: filter });
            if (!categoryDoc) {
                throw new Error('Category not found');
            }
            query.category = categoryDoc._id;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const products = yield this.find(query).populate('category');
        return products.map(product => {
            const finalPrice = parseFloat((product.price - (product.price * product.discount) / 100).toFixed(2));
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
    });
};
// product code generation using pre hook
productSchema.pre('save', function (next) {
    const name = this.name;
    const compact = name.toLowerCase().split(' ').join('');
    const letters = compact.split('');
    let result = [];
    let maxLen = 0;
    let start = 0;
    for (let i = 1; i <= letters.length; i++) {
        if (i === letters.length || letters[i] <= letters[i - 1]) {
            const len = i - start;
            const substring = compact.slice(start, i);
            if (len > maxLen) {
                maxLen = len;
                result = [{ value: substring, start, end: i - 1 }];
            }
            else if (len === maxLen) {
                result.push({ value: substring, start, end: i - 1 });
            }
            start = i;
        }
    }
    const merged = result.map(r => r.value).join('');
    const firstStart = result[0].start;
    const lastEnd = result[result.length - 1].end;
    const hash = crypto_1.default.createHash('sha256').update(name).digest('hex').slice(0, 7);
    this.productCode = `${hash}-${firstStart}${merged}${lastEnd}`;
    next();
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
