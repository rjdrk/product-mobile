import { StorageKey, StoredData } from "@/types/Storage";
import { IExpirationStorage, IStorage } from "../interfaces/storage.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_CONFIG } from "@/utils/storage-config";


export class AsyncStorageService implements IStorage, IExpirationStorage {
    async save<T>(key: StorageKey, data: T): Promise<void> {
        try {
            const storedData: StoredData<T> = {
                data,
                timestamp: Date.now(),
            }

            await AsyncStorage.setItem(key.toString(), JSON.stringify(storedData));
        } catch (error) {

        }
    }

    async get<T>(key: StorageKey): Promise<T | null> {
        try {
            const item = await AsyncStorage.getItem(key.toString());
            if (!item) return null;

            const storedData: StoredData<T> = JSON.parse(item);
            return storedData.data;
        } catch (error) {
            console.error(`Error al obtener ${key.toString()}:`, error);
            return null;
        }
    }

    async remove(key: StorageKey): Promise<void> {
        try {
            await AsyncStorage.removeItem(key.toString());
        } catch (error) {
            console.error(`Error al eliminar ${key.toString()}:`, error);
            throw error;
        }
    }

    async getAllKeys(): Promise<StorageKey[]> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            return keys.map(k => ({ toString: () => k } as StorageKey));
        } catch (error) {
            console.error('Error al obtener todas las claves:', error);
            return [];
        }
    }

    async isExpired(key: StorageKey): Promise<boolean> {
        try {
            const item = await AsyncStorage.getItem(key.toString());
            if (!item) return true;

            const storedData: StoredData<any> = JSON.parse(item);
            const now = Date.now();
            return (now - storedData.timestamp) > STORAGE_CONFIG.EXPIRATION_TIME;
        } catch (error) {
            console.error(`Error al verificar caducidad de ${key.toString()}:`, error);
            return true;
        }
    }

    async clearExpired(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const now = Date.now();

            for (const keyString of allKeys) {
                const data = await AsyncStorage.getItem(keyString);
                if (data) {
                    try {
                        const parsedData: StoredData<any> = JSON.parse(data);
                        if ((now - parsedData.timestamp) > STORAGE_CONFIG.EXPIRATION_TIME) {
                            await AsyncStorage.removeItem(keyString);
                            console.log(`Eliminados datos caducados: ${keyString}`);
                        }
                    } catch (error) {
                        console.log('No es un dato con formato StoredData: ', error)
                    }
                }
            }
        } catch (error) {
            console.error('Error al limpiar datos caducados: ', error);
        }
    }
}