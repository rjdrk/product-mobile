import { AsyncStorageService } from './storage/implementations/async-storage';
import { ProductDetailsStorage } from './storage/implementations/product-storage';
import { ProductPageStorage } from './storage/implementations/products-storage';
import { SyncManager } from './storage/sync-manager';

// Crear instancias respetando la inversión de dependencias
const asyncStorage = new AsyncStorageService();
const productPageStorage = new ProductPageStorage(asyncStorage);
const productDetailsStorage = new ProductDetailsStorage(asyncStorage);
const syncManager = new SyncManager();

// Exportar interfaces (no implementaciones) para mejor tipado
export { IProductPageStorage, IProductDetailsStorage, ISyncManager } from './storage/interfaces/storage.interface';

// Exportar instancias para uso directo
export { productPageStorage, productDetailsStorage, syncManager };

// Exportar funciones específicas para facilitar el uso
export const saveProductsPage = productPageStorage.savePage.bind(productPageStorage);
export const getProductsPage = productPageStorage.getPage.bind(productPageStorage);
export const isPageExpired = productPageStorage.isPageExpired.bind(productPageStorage);
export const searchProductsLocally = productPageStorage.searchProducts.bind(productPageStorage);

export const saveProductDetails = productDetailsStorage.saveProductDetails.bind(productDetailsStorage);
export const getProductDetails = productDetailsStorage.getProductDetails.bind(productDetailsStorage);
export const areProductDetailsExpired = productDetailsStorage.areProductDetailsExpired.bind(productDetailsStorage);

export const getLastSyncTimestamp = syncManager.getLastSyncTimestamp.bind(syncManager);
export const clearAllProductData = syncManager.clearAllProductData.bind(syncManager);
export const cleanupExpiredData = syncManager.cleanupExpiredData.bind(syncManager);