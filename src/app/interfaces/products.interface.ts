import { Model, Types} from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  status: "In Stock" | "Stock Out";
  productCode: string;
  category: Types.ObjectId;
}

export interface ProductResponse {
  description: string;
  image: string;
  status: string;
  price: number;
  discount: number;
  finalPrice: number;
  category: any;
}

export interface ProductStaticMethod extends Model<IProduct> {
  getFilteredProducts(filters: { filter?: string; search?: string }): Promise<ProductResponse[]>;
}
