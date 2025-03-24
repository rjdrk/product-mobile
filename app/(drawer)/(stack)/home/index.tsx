import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useProductStore } from '@/store/product.store';
import { ProductCard } from '@/components/home/ProductCard';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { useNetworkMonitor } from '@/store/network.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const HomeScreeView = () => {
    const router = useRouter();
    const {
        products,
        isLoading,
        error,
        loadProducts,
        loadMoreProducts,
        refreshProducts,

    } = useProductStore();

    useNetworkMonitor();

    useEffect(() => {
        loadProducts();
    }, []);

    const close = async () => {
        await AsyncStorage.removeItem("authToken");
        router.push("/login");
    }
    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4 bg-white">
                <Text className="text-red-500 text-lg mb-4">{error}</Text>
                <TouchableOpacity
                    className="bg-blue-500 py-2 px-6 rounded-lg"
                    onPress={() => loadProducts()}
                >
                    <Text className="text-white font-semibold">Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading && products.length === 0) {
        return <LoadingIndicator fullScreen={true} />;
    }

    const renderHeader = () => (
        <>
            <OfflineIndicator />
            <View className="p-4 bg-gray-100">
                <Pressable onPress={close} style={styles.button}>
                    <Text style={styles.buttonText}>Cerrer Session</Text>
                </Pressable>
            </View>
        </>
    );
    const renderFooter = () => (
        isLoading ? <LoadingIndicator /> : null
    );
    return (
        <View className="flex-1 bg-gray-100">
            <StatusBar style="dark" />

            <FlatList
                data={products}
                keyExtractor={(item) => item.idProducto.toString()}
                renderItem={({ item }) => <ProductCard product={item} />}
                contentContainerClassName="p-4 pb-20"
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center p-4 mt-10">
                        <Text className="text-gray-500 text-lg">No hay productos disponibles</Text>
                    </View>
                }
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.3}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && products.length > 0}
                        onRefresh={refreshProducts}
                        colors={['#4B5563']}
                    />
                }
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    button: {
        backgroundColor: "#0047AB",
        padding: 15,
        borderRadius: 5,
        marginTop: 20, // Añadir espacio
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
})

export default HomeScreeView