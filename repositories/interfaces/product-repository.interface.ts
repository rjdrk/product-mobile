import { Product, Products } from "@/types/Products";

export interface ProductRepositoryInterface {
    getProducts(page: number, limit: number): Promise<Products>;
    getProductById(productId: string): Promise<Product | null>;
}