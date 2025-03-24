import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '@/types/Products';
import { Link } from 'expo-router';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link href={`/product/${product.idProducto}`} asChild>
            <TouchableOpacity className="bg-white rounded-lg shadow-md p-3 mb-3">
                <View className="flex-row">

                    <View className="flex-1 ml-3">
                        <Text className="text-lg font-bold text-gray-800">{product.nombre}</Text>
                        <Text className="text-sm text-gray-500 mb-1" numberOfLines={2}>
                            {product.descripcion}
                        </Text>
                        <Text className="text-lg font-semibold text-blue-600">
                            ${product.precio.toFixed(2)}
                        </Text>
                        <View className="flex-row justify-between items-center mt-1">
                            <Text className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};