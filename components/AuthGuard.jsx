import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated } from '../services/authService';

export function AuthGuard({ children }) {
    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            if (!isAuth) {
                router.replace('/login');
            }
        };

        checkAuth();
    }, []);

    return (
        <View className="flex-1">
            {children}
        </View>
    );
} 