import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductPageStorage } from './implementations/products-storage';
import { ProductDetailsStorage } from './implementations/product-storage';
import { ISyncManager } from './interfaces/storage.interface';
import { AsyncStorageService } from './implementations/async-storage';
import { SyncKey } from '@/types/Storage';

export class SyncManager implements ISyncManager {
    private productPageStorage: ProductPageStorage;
    private productDetailsStorage: ProductDetailsStorage;
    private storage: AsyncStorageService;

    constructor() {
        this.storage = new AsyncStorageService();
        this.productPageStorage = new ProductPageStorage(this.storage);
        this.productDetailsStorage = new ProductDetailsStorage(this.storage);
    }

    async getLastSyncTimestamp(): Promise<number | null> {
        try {
            const timestamp = await AsyncStorage.getItem(new SyncKey().toString());
            return timestamp ? parseInt(timestamp, 10) : null;
        } catch (error) {
            console.error('Error al obtener timestamp de última sincronización:', error);
            return null;
        }
    }

    async clearAllProductData(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const productKeys = allKeys.filter(key =>
                key.startsWith('product_page_') ||
                key.startsWith('product_details_') ||
                key === new SyncKey().toString()
            );

            if (productKeys.length > 0) {
                await AsyncStorage.multiRemove(productKeys);
                console.log('🧹 Todos los datos de productos han sido eliminados');
            }
        } catch (error) {
            console.error('Error al limpiar todos los datos:', error);
            throw error;
        }
    }

    async cleanupExpiredData(): Promise<void> {
        await this.storage.clearExpired();
    }
}