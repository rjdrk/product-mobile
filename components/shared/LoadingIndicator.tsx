import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface LoadingIndicatorProps {
    fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#4B5563" />
            </View>
        );
    }

    return (
        <View className="py-4 items-center">
            <ActivityIndicator color="#4B5563" />
        </View>
    );
};