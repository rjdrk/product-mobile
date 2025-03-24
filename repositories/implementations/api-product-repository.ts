import api from "@/core/api/axios-config";
import { Products, Product } from "@/types/Products";
import { ProductRepositoryInterface } from "../interfaces/product-repository.interface";

export class ApiProductRepository implements ProductRepositoryInterface {
    constructor(authToken?: string) { }
    async getProducts(page: number = 1, limit: number = 10): Promise<Products> {
        try {
            const response = await api.get(`/productos/?pageNumber=${page}&pageSize=${limit}`);
            return {
                data: response.data.data,
                pageSize: response.data.pageSize,
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems,
                currentPages: response.data.currentPages
            };
        } catch (error) {
            console.error("Error fetching products from API:", error);
            throw error;
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            const response = await api.get(`/productos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with id ${id} from API:`, error);
            return null;
        }
    }
}