import { Products, Product } from '@/types/Products'
import { ProductRepositoryInterface } from '../interfaces/product-repository.interface';
import { ApiProductRepository } from './api-product-repository';
import { LocalProductRepository } from './local-product-repository';
import NetInfo from '@react-native-community/netinfo';

export class HybridProductRepository implements ProductRepositoryInterface {
    constructor(
        private apiRepository: ApiProductRepository,
        private localRepository: LocalProductRepository
    ) { }

    async getProducts(page: number = 1, limit: number = 5): Promise<Products> {
        try {
            // Verificar conexión a internet
            const netInfo = await NetInfo.fetch();

            // Verificar si los datos locales han expirado
            const isLocalDataExpired = await this.localRepository.isPageExpired(page);

            const localProducts = await this.localRepository.getProducts(page, limit);

            if (netInfo.isConnected && localProducts.data.length || isLocalDataExpired) {
                // Con conexión y sin datos locales o datos expirados: obtener datos de la API y actualizar caché local
                try {
                    const apiProducts = await this.apiRepository.getProducts(page, limit);
                    // Almacenar los productos en el almacenamiento local
                    await this.localRepository.savePage(apiProducts);
                    return apiProducts;
                } catch (apiError) {
                    console.error('Error consultando la API:', apiError);
                    // Si hay error en la API pero tenemos datos locales, usar esos aunque estén expirados
                    const localProducts = await this.localRepository.getProducts(page, limit);
                    if (localProducts.data.length > 0) {
                        return localProducts;
                    }
                    throw apiError; // Re-lanzar error si no hay alternativa
                }
            } else {
                // Sin conexión o datos locales no expirados: obtener datos del almacenamiento local
                const localProducts = await this.localRepository.getProducts(page, limit);
                if (localProducts.data.length > 0) {
                    if (!netInfo.isConnected) {
                        console.log('Red fuera de línea, obteniendo datos del almacenamiento local');
                    } else {
                        console.log('Usando datos en caché (no expirado)');
                    }
                    return localProducts;
                } else if (netInfo.isConnected) {
                    // Si no hay datos locales pero hay conexión, intentar con la API
                    const apiProducts = await this.apiRepository.getProducts(page, limit);
                    await this.localRepository.savePage(apiProducts);
                    return apiProducts;
                } else {
                    // Sin conexión y sin datos locales
                    return {
                        data: [],
                        currentPages: page,
                        totalPages: 0,
                        totalItems: 0,
                        pageSize: limit
                    };
                }
            }
        } catch (error) {
            console.error('Error in hybrid repository getProducts:', error);
            // Si hay error, intentar con almacenamiento local como último recurso
            return await this.localRepository.getProducts(page, limit);
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            // Verificar conexión a internet
            const netInfo = await NetInfo.fetch();

            // Verificar si los datos locales han expirado
            const isLocalDataExpired = await this.localRepository.areProductDetailsExpired(id);
            const localProduct = await this.localRepository.getProductById(id);

            if (netInfo.isConnected && (!localProduct || isLocalDataExpired)) {
                // Con conexión y sin datos locales o datos expirados: obtener datos de la API
                try {
                    const product = await this.apiRepository.getProductById(id);
                    if (product) {
                        // Actualizar el producto en el almacenamiento local
                        await this.localRepository.saveProductDetails(product);
                    }
                    return product;
                } catch (apiError) {
                    console.error(`Error fetching product with id ${id} from API:`, apiError);
                    // Si hay error en la API pero tenemos datos locales, usar esos aunque estén expirados
                    if (localProduct) {
                        return localProduct;
                    }
                    return null;
                }
            } else {
                // Sin conexión o datos locales no expirados: obtener datos del almacenamiento local
                if (localProduct) {
                    if (!netInfo.isConnected) {
                        console.log('Network offline, fetching product from local storage');
                    } else {
                        console.log('Using cached product data (not expired)');
                    }
                    return localProduct;
                } else if (netInfo.isConnected) {
                    // Si no hay datos locales pero hay conexión, intentar con la API
                    const product = await this.apiRepository.getProductById(id);
                    if (product) {
                        await this.localRepository.saveProductDetails(product);
                    }
                    return product;
                } else {
                    // Sin conexión y sin datos locales
                    return null;
                }
            }
        } catch (error) {
            console.error(`Error in hybrid repository getProductById(${id}):`, error);
            // Si hay error, intentar con almacenamiento local como último recurso
            return await this.localRepository.getProductById(id);
        }
    }

}