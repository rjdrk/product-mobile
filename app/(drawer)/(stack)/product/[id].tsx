import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '@/store/product.store';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { Ionicons } from '@expo/vector-icons';

const ProductScreenView = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { selectedProduct, isLoading, error, getProductById } = useProductStore();

    useEffect(() => {
        if (id) {
            getProductById(id);
        }
    }, [id]);

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4 bg-white">
                <Text className="text-red-500 text-lg mb-4">{error}</Text>
                <TouchableOpacity
                    className="bg-blue-500 py-2 px-6 rounded-lg"
                    onPress={() => getProductById(id)}
                >
                    <Text className="text-white font-semibold">Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading || !selectedProduct) {
        return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <SafeAreaView className="mt-10 pb-10 flex-1 bg-white">
            <OfflineIndicator />

            <ScrollView>
                <View className="p-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-2xl font-bold text-gray-800">{selectedProduct.nombre}</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back-circle" size={28} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xl font-bold text-blue-600 mb-3">
                        ${selectedProduct.precio.toFixed(2)}
                    </Text>

                    <View className="bg-gray-100 p-3 rounded-lg mb-4">
                        <Text className={`text-sm font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {selectedProduct.stock > 0 ? `En stock: ${selectedProduct.stock} unidades` : 'Producto agotado'}
                        </Text>
                    </View>

                    <Text className="text-lg font-semibold text-gray-700 mb-2">Descripción</Text>
                    <Text className="text-gray-600 mb-6">{selectedProduct.descripcion}</Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProductScreenView