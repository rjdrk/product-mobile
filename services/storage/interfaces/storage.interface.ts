import { StorageKey } from "@/types/Storage";

// Interfaz básica de almacenamiento
export interface IStorage {
    save<T>(key: StorageKey, data: T): Promise<void>;
    get<T>(key: StorageKey): Promise<T | null>;
    remove(key: StorageKey): Promise<void>;
    getAllKeys(): Promise<StorageKey[]>;
}

// Interfaz para funcionalidad de caducidad
export interface IExpirationStorage {
    isExpired(key: StorageKey): Promise<boolean>;
    clearExpired(): Promise<void>;
}

// Interfaz para almacenamiento de productos
export interface IProductPageStorage {
    savePage(response: import('../../../types/Products').Products): Promise<void>;
    getPage(page: number): Promise<import('../../../types/Products').Products | null>;
    isPageExpired(page: number): Promise<boolean>;
    searchProducts(query: string): Promise<import('../../../types/Products').Product[]>;
}

// Interfaz para almacenamiento de detalles de productos
export interface IProductDetailsStorage {
    saveProductDetails(product: import('../../../types/Products').Product): Promise<void>;
    getProductDetails(productId: number): Promise<import('../../../types/Products').Product | null>;
    areProductDetailsExpired(productId: number): Promise<boolean>;
}

// Interfaz para sincronización
export interface ISyncManager {
    getLastSyncTimestamp(): Promise<number | null>;
    clearAllProductData(): Promise<void>;
    cleanupExpiredData(): Promise<void>;
}