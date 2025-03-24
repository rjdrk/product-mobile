import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { addConnectionChangeListener } from '@/core/network/network-info';

export const useNetworkStatus = () => {
    const [isNetworkConnected, setIsNetworkConnected] = useState<boolean | null>(null);

    useEffect(() => {
        NetInfo.fetch().then((state) => {
            setIsNetworkConnected(!!state.isConnected && !!state.isInternetReachable);
        })

        const removeListener = addConnectionChangeListener((online) => {
            setIsNetworkConnected(online);
        });

        return removeListener;
    }, []);

    return isNetworkConnected;
}