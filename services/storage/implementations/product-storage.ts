import { Product } from "@/types/Products";
import { IProductDetailsStorage } from "../interfaces/storage.interface";
import { AsyncStorageService } from "./async-storage";
import { ProductDetailsKey } from "@/types/Storage";

export class ProductDetailsStorage implements IProductDetailsStorage {
    constructor(private storage: AsyncStorageService) { }

    async saveProductDetails(product: Product): Promise<void> {
        const key = new ProductDetailsKey(product.idProducto);
        await this.storage.save(key, product);
        console.log(`Guardados detalles del producto ${product.idProducto}`);
    }

    async getProductDetails(productId: number): Promise<Product | null> {
        const key = new ProductDetailsKey(productId);
        return this.storage.get<Product>(key);
    }

    async areProductDetailsExpired(productId: number): Promise<boolean> {
        const key = new ProductDetailsKey(productId);
        return this.storage.isExpired(key);
    }
}