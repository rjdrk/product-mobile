import AsyncStorage from "@react-native-async-storage/async-storage";

interface QueuedRequest {
    method: string;
    url: string;
    data?: any;
    params?: any;
}

export const saveRequestToQueue = async (request: QueuedRequest) => {
    try {
        const queue = await getRequestQueue();
        queue.push(request);
        await AsyncStorage.setItem('offline_request_queue', JSON.stringify(queue));
    } catch (error) {
        console.error('Error saving request to queue', error);
    }
};

export const getRequestQueue = async (): Promise<QueuedRequest[]> => {
    try {
        const queue = await AsyncStorage.getItem('offline_request_queue');
        return queue ? JSON.parse(queue) : [];
    } catch (error) {
        console.error('Error getting request queue', error);
        return [];
    }
};

export const clearRequestQueue = async () => {
    await AsyncStorage.setItem('offline_request_queue', JSON.stringify([]));
};