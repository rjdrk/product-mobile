import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'authToken';

export const saveAuthToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};