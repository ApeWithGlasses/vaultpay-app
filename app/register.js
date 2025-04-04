import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { userService } from "../services/userService";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        if (password.length < 4) {
            Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            setIsLoading(true);
            const userData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            };

            console.log('Intentando registrar usuario:', {
                ...userData,
                password: '***'
            });

            await userService.register(userData);
            
            Alert.alert(
                'Registro exitoso',
                'Tu cuenta ha sido creada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login')
                    }
                ]
            );
        } catch (error) {
            console.error('Error en componente de registro:', {
                message: error.message,
                stack: error.stack
            });

            Alert.alert(
                'Error de registro',
                error.message === 'Failed to fetch' 
                    ? 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.'
                    : error.message || 'Hubo un problema al intentar registrar el usuario'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6 items-center justify-center">
            <Logo />

            <Text className="text-2xl font-bold mb-8 text-gray-800">Crear Cuenta</Text>

            <TextInput
                className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base bg-white"
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!isLoading}
            />

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
                className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base bg-white"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
            />

            <TextInput
                className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg text-base bg-white"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
            />

            <Pressable 
                className={`w-full py-4 rounded-lg items-center shadow-md ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-base font-semibold">Registrarse</Text>
                )}
            </Pressable>

            <View className="flex-row mt-6 items-center">
                <Text className="text-gray-600 text-sm">¿Ya tienes una cuenta? </Text>
                <Link href="/login" asChild>
                    <Pressable disabled={isLoading}>
                        <Text className="text-blue-500 text-sm font-semibold">Inicia sesión aquí</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
} 