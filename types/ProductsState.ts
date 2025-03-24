import { Product } from '@/types/Products';

export interface ProductState {
    // Estado
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;
    selectedProduct: Product | null;
    isOfflineData: boolean;

    // Acciones
    loadProducts: (page?: number) => Promise<void>;
    loadMoreProducts: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    getProductById: (id: string) => Promise<void>;
    clearError: () => void;
}