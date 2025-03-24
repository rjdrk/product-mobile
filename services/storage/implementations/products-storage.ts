import { AsyncStorageService } from './async-storage';
import { IProductPageStorage } from '../interfaces/storage.interface';
import { Product, Products } from '@/types/Products';
import { ProductPageKey, SyncKey } from '@/types/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ProductPageStorage implements IProductPageStorage {
    constructor(private storage: AsyncStorageService) { }

    async savePage(response: Products): Promise<void> {
        const key = new ProductPageKey(response.currentPages);
        await this.storage.save(key, response);
        await AsyncStorage.setItem(new SyncKey().toString(), Date.now().toString());
        console.log(`Guardados ${response.data.length} productos para página ${response.currentPages}`);
    }

    async getPage(page: number): Promise<Products | null> {
        const key = new ProductPageKey(page);
        return this.storage.get<Products>(key);
    }

    async isPageExpired(page: number): Promise<boolean> {
        const key = new ProductPageKey(page);
        return this.storage.isExpired(key);
    }

    async searchProducts(query: string): Promise<Product[]> {
        try {
            const allKeys = await this.storage.getAllKeys();
            let allProducts: Product[] = [];

            for (const key of allKeys) {
                if (key.toString().startsWith('product_page_')) {
                    const response = await this.storage.get<Products>(key);
                    if (response) {
                        allProducts = [...allProducts, ...response.data];
                    }
                }
            }

            const lowerQuery = query.toLowerCase();
            return allProducts.filter(product =>
                product.nombre.toLowerCase().includes(lowerQuery) ||
                product.descripcion.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Error al buscar productos localmente:', error);
            return [];
        }
    }

}