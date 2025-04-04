import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';

export const tokenService = {
    setToken: async (token) => {
        try {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    getToken: async () => {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    removeToken: async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    getAuthHeaders: async () => {
        const token = await tokenService.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }
}; 