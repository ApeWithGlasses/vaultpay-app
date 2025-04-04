import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { login, isAuthenticated } from "../services/authService";

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticated();
            if (isAuth) {
                router.replace('/dashboard');
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        try {
            setIsLoading(true);

            await login(email, password);
            router.replace('/dashboard');
        } catch (error) {
            Alert.alert(
                'Error de inicio de sesión',
                error.message || 'Hubo un problema al intentar iniciar sesión'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6 items-center justify-center">
            <Logo />

            <Text className="text-2xl font-bold mb-8 text-gray-800">Iniciar Sesión</Text>

            <TextInput
                className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base bg-white"
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
            />

            <TextInput
                className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg text-base bg-white"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
            />

            <Pressable 
                className={`w-full py-4 rounded-lg items-center shadow-md ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-base font-semibold">Iniciar Sesión</Text>
                )}
            </Pressable>

            <View className="flex-row mt-6 items-center">
                <Text className="text-gray-600 text-sm">¿No tienes una cuenta? </Text>
                <Link href="/register" asChild>
                    <Pressable disabled={isLoading}>
                        <Text className="text-blue-500 text-sm font-semibold">Regístrate aquí</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}