import { create } from 'zustand';
import { ProductState } from '@/types/ProductsState';
import { getProductRepository } from '../repositories';
import NetInfo from '@react-native-community/netinfo';

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    isLoading: false,
    error: null,
    selectedProduct: null,
    isOfflineData: false,

    loadProducts: async (page = 1) => {
        try {
            set({ isLoading: true, error: null });

            const netInfo = await NetInfo.fetch();

            const repository = await getProductRepository();
            const result = await repository.getProducts(page, 10);

            if (page === 1) {
                set({
                    products: result.data,
                    isOfflineData: !netInfo.isConnected,
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalItems: result.totalItems,
                    isLoading: false
                });
            } else {
                set(state => ({
                    products: [...state.products, ...result.data],
                    isOfflineData: !netInfo.isConnected,
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalItems: result.totalItems,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Error loading products:', error);
            set({
                error: error instanceof Error ? error.message : 'Error al cargar productos',
                isLoading: false
            });
        }
    },

    loadMoreProducts: async () => {
        const { currentPage, totalPages, isLoading } = get();

        if (currentPage >= totalPages || isLoading) {
            return;
        }

        await get().loadProducts(currentPage + 1);
    },

    refreshProducts: async () => {
        try {
            set({ isLoading: true, error: null });

            const repository = await getProductRepository();
            const result = await repository.getProducts(1, 10);

            const netInfo = await NetInfo.fetch();

            set({
                products: result.data,
                isOfflineData: !netInfo.isConnected,
                currentPage: 1,
                totalPages: result.totalPages,
                totalItems: result.totalItems,
                isLoading: false
            });
        } catch (error) {
            console.error('Error refreshing products:', error);
            set({
                error: error instanceof Error ? error.message : 'Error al refrescar productos',
                isLoading: false
            });
        }
    },

    getProductById: async (id: string) => {
        try {
            set({ isLoading: true, error: null, selectedProduct: null });

            const netInfo = await NetInfo.fetch();

            const repository = await getProductRepository();
            const product = await repository.getProductById(id);

            set({
                selectedProduct: product,
                isOfflineData: !netInfo.isConnected,
                isLoading: false
            });
        } catch (error) {
            console.error(`Error loading product ${id}:`, error);
            set({
                error: error instanceof Error ? error.message : 'Error al cargar el producto',
                isLoading: false
            });
        }
    },

    clearError: () => set({ error: null }),
}));
