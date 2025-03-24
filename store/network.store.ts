import { create } from 'zustand';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect } from 'react';

interface NetworkState {
    isConnected: boolean | null;
    connectionType: string | null;
    setNetworkState: (state: NetInfoState) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
    isConnected: null,
    connectionType: null,

    setNetworkState: (state: NetInfoState) => set({
        isConnected: state.isConnected,
        connectionType: state.type,
    }),
}));

// Hook para suscribirse a los cambios de red
export const useNetworkMonitor = () => {
    useEffect(() => {
        // Configurar estado inicial
        NetInfo.fetch().then(state => {
            useNetworkStore.getState().setNetworkState(state);
        });

        // Suscribirse a los cambios de conectividad
        const unsubscribe = NetInfo.addEventListener(state => {
            useNetworkStore.getState().setNetworkState(state);
        });

        // Limpiar suscripción
        return () => unsubscribe();
    }, []);

    return useNetworkStore();
};