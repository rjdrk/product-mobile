import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios-config';

export const login = async (body: any) => {

    try {
        const response = await api.post('/auth/login', body);
        const token = response.data.token;
        await AsyncStorage.setItem("authToken", token);

        return token;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};