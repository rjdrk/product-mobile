import { API_URL } from '@env';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

let isConnected = false;
let unsubscribe: NetInfoSubscription | null = null;

const connectionChangeListeners: ((isConnected: boolean) => void)[] = [];

NetInfo.configure({
    reachabilityUrl: API_URL,
    reachabilityTest: async (response) => response.status === 200,
    reachabilityLongTimeout: 60 * 1000,
    reachabilityShortTimeout: 5 * 1000,
    reachabilityRequestTimeout: 15 * 1000,
})

// Manejador de cambios de conectividad
export const handleConnectivityChange = (state: NetInfoState) => {
    const online = !!state.isConnected && !!state.isInternetReachable;

    //Solo notificar cuando hay un cambio real
    if (isConnected !== online) {
        isConnected = online;
        console.log(`La conectividad ha cambiado: ${online ? 'Online' : 'Offline'}`);

        //Notificar a los listener
        connectionChangeListeners.forEach(listener => listener(online));
    }
}

// Suscribir cambios de la conexion
export const startNetworkMonitoring = () => {
    if (!unsubscribe) {
        unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

        NetInfo.fetch().then(handleConnectivityChange);
    }
}

// Registra el listener
export const addConnectionChangeListener = (listener: (isConnected: boolean) => void) => {
    connectionChangeListeners.push(listener);
    return () => {
        const index = connectionChangeListeners.indexOf(listener);
        if (index !== 1) connectionChangeListeners.splice(index, 1);
    }
}

// Función para detener el monitoreo
export const stopNetworkMonitoring = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};

// Obtener estado actual de la conexión
export const getCurrentConnectionStatus = (): boolean => isConnected;

export const checkConection = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return !!state.isConnected && !!state.isInternetReachable;
}