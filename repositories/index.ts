import { ApiProductRepository } from './implementations/api-product-repository';
import { LocalProductRepository } from './implementations/local-product-repository';
import { HybridProductRepository } from './implementations/hybrid-product-repository';
import { AsyncStorageService } from '../services/storage/implementations/async-storage';
import { ProductPageStorage } from '../services/storage/implementations/products-storage';
import { ProductDetailsStorage } from '../services/storage/implementations/product-storage';
import { getAuthToken } from '../core/auth/auth';

let productRepository: HybridProductRepository | null = null;

export const getProductRepository = async (): Promise<HybridProductRepository> => {
    if (!productRepository) {
        const authToken = await getAuthToken();

        // Crear servicios de almacenamiento
        const storageService = new AsyncStorageService();

        // Crear implementaciones específicas para almacenamiento de productos
        const productPageStorage = new ProductPageStorage(storageService);
        const productDetailsStorage = new ProductDetailsStorage(storageService);

        // Crear repositorios
        const apiRepo = new ApiProductRepository();
        const localRepo = new LocalProductRepository(productPageStorage, productDetailsStorage);

        // Crear repositorio híbrido
        productRepository = new HybridProductRepository(apiRepo, localRepo);
    }
    return productRepository;
};

// Para casos donde necesitemos específicamente el repositorio local o de API
export const getLocalProductRepository = (): LocalProductRepository => {
    const storageService = new AsyncStorageService();
    const productPageStorage = new ProductPageStorage(storageService);
    const productDetailsStorage = new ProductDetailsStorage(storageService);
    return new LocalProductRepository(productPageStorage, productDetailsStorage);
};

export const getApiProductRepository = async (): Promise<ApiProductRepository> => {
    const authToken = await getAuthToken();
    return new ApiProductRepository();
};