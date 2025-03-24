// Tipos básicos para almacenamiento
export interface StoredData<T> {
    data: T;
    timestamp: number;
}

export interface StorageKey {
    toString(): string;
}

// Clases de clave para diferentes entidades
export class ProductPageKey implements StorageKey {
    constructor(private page: number) { }

    toString(): string {
        return `product_page_${this.page}`;
    }
}

export class ProductDetailsKey implements StorageKey {
    constructor(private productId: number) { }

    toString(): string {
        return `product_details_${this.productId}`;
    }
}

export class SyncKey implements StorageKey {
    toString(): string {
        return 'products_last_sync';
    }
}