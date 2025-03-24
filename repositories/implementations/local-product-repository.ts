import { Product, Products } from '@/types/Products'
import { ProductRepositoryInterface } from '../interfaces/product-repository.interface';
import { IProductDetailsStorage, IProductPageStorage } from '../../services/storage/interfaces/storage.interface';


export class LocalProductRepository implements ProductRepositoryInterface {
    constructor(
        private productPageStorage: IProductPageStorage,
        private productDetailsStorage: IProductDetailsStorage
    ) { }

    async getProducts(page: number = 1, limit: number = 5): Promise<Products> {
        try {
            const cachedPage = await this.productPageStorage.getPage(page);

            if (cachedPage) {
                return {
                    data: cachedPage.data,
                    pageSize: cachedPage.pageSize,
                    totalPages: cachedPage.totalPages,
                    totalItems: cachedPage.totalPages,
                    currentPages: cachedPage.currentPages,
                };
            }

            return {
                data: [],
                pageSize: 5,
                totalPages: 0,
                totalItems: 0,
                currentPages: 1
            }
        } catch (error) {
            console.error("Error fetching products from local storage:", error);
            return {
                data: [],
                pageSize: 5,
                totalPages: 0,
                totalItems: 0,
                currentPages: 1
            };
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            return await this.productDetailsStorage.getProductDetails(Number(id));
        } catch (error) {
            console.error(`Error fetching product with id ${id} from local storage:`, error);
            return null;
        }
    }

    // Método para verificar si una página está expirada
    async isPageExpired(page: number): Promise<boolean> {
        return await this.productPageStorage.isPageExpired(page);
    }

    // Método para verificar si los detalles de un producto están expirados
    async areProductDetailsExpired(productId: string): Promise<boolean> {
        return await this.productDetailsStorage.areProductDetailsExpired(Number(productId));
    }

    // Método para guardar una página de productos en el almacenamiento local
    async savePage(products: Products): Promise<void> {
        await this.productPageStorage.savePage({
            data: products.data,
            pageSize: products.pageSize,
            totalPages: products.totalPages,
            totalItems: products.totalItems,
            currentPages: products.currentPages
        });
    }

    // Método para guardar los detalles de un producto en el almacenamiento local
    async saveProductDetails(product: Product): Promise<void> {
        await this.productDetailsStorage.saveProductDetails(product);
    }
}