import React from 'react';
import { View, Text } from 'react-native';
import { useNetworkStore } from '@/store/network.store';
import { useProductStore } from '@/store/product.store';

export const OfflineIndicator = () => {
    const { isConnected } = useNetworkStore();
    const { isOfflineData } = useProductStore();

    if (isConnected === false || isOfflineData) {
        return (
            <View className="bg-orange-500 py-2 px-3 w-full items-center">
                <Text className="text-white text-xs font-bold">
                    {isConnected === false
                        ? '📶 Sin conexión a internet. Usando datos almacenados.'
                        : '⚠️ Mostrando datos almacenados.'}
                </Text>
            </View>
        );
    }
    return null;
};