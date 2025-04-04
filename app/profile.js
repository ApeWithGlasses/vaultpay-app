import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { userService } from '../services/userService';
import { tokenService } from '../services/tokenService';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const loadUserData = async () => {
        try {
            const token = await tokenService.getToken();
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userData = await userService.getUserByEmail(tokenData.sub);
            setUser(userData);
            setFormData({
                name: userData.name,
                email: userData.email,
                password: '',
            });

            const accountsData = await userService.getUserAccounts(userData.id);
            setAccounts(accountsData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            Alert.alert('Error', 'Error al cargar los datos del usuario');
            router.replace('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleUpdateUser = async () => {
        try {
            if (!formData.name || !formData.email) {
                Alert.alert('Error', 'Por favor completa los campos requeridos');
                return;
            }

            const userData = {
                ...formData,
                id: user.id,
            };

            await userService.updateUser(userData);
            setIsEditing(false);
            loadUserData();
            Alert.alert('Éxito', 'Datos actualizados correctamente');
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudieron actualizar los datos');
        }
    };

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const accountCount = accounts.length;

    return (
        <AuthGuard>
            <ScrollView className="flex-1 bg-white">
                <View className="bg-blue-500 p-6 rounded-b-3xl shadow-lg">
                    <View className="flex-row items-center mb-4">
                        <Pressable 
                            onPress={() => router.back()}
                            className="p-2"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </Pressable>
                        <Text className="text-2xl font-bold text-white ml-2">Mi Perfil</Text>
                    </View>
                    <View className="items-center mt-4 mb-8">
                        <View className="bg-white rounded-full p-6 shadow-lg">
                            <Ionicons name="person" size={60} color="#3B82F6" />
                        </View>
                    </View>
                </View>

                <View className="p-6">
                    <View className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-semibold text-gray-800">Información Personal</Text>
                            <Pressable
                                onPress={() => setIsEditing(!isEditing)}
                                className="bg-blue-100 p-2 rounded-full"
                            >
                                <Ionicons 
                                    name={isEditing ? "close" : "pencil"} 
                                    size={20} 
                                    color="#3B82F6" 
                                />
                            </Pressable>
                        </View>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm text-gray-600 mb-1">Nombre</Text>
                                <TextInput
                                    className={`w-full h-12 px-4 rounded-lg text-base bg-white border ${isEditing ? 'border-blue-300' : 'border-gray-200'}`}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({...formData, name: text})}
                                    editable={isEditing}
                                />
                            </View>

                            <View>
                                <Text className="text-sm text-gray-600 mb-1">Email</Text>
                                <TextInput
                                    className={`w-full h-12 px-4 rounded-lg text-base bg-white border ${isEditing ? 'border-blue-300' : 'border-gray-200'}`}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({...formData, email: text})}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                />
                            </View>

                            {isEditing && (
                                <View>
                                    <Text className="text-sm text-gray-600 mb-1">Nueva Contraseña (opcional)</Text>
                                    <TextInput
                                        className="w-full h-12 px-4 rounded-lg text-base bg-white border border-blue-300"
                                        value={formData.password}
                                        onChangeText={(text) => setFormData({...formData, password: text})}
                                        secureTextEntry
                                        placeholder="Dejar en blanco para mantener la actual"
                                    />
                                </View>
                            )}
                        </View>

                        {isEditing && (
                            <Pressable
                                onPress={handleUpdateUser}
                                className="bg-blue-500 py-3 rounded-lg mt-6"
                            >
                                <Text className="text-white text-center font-semibold">Guardar Cambios</Text>
                            </Pressable>
                        )}
                    </View>

                    <View className="bg-white rounded-xl shadow-md p-6">
                        <Text className="text-xl font-semibold text-gray-800 mb-6">Estadísticas</Text>
                        <View className="flex-row justify-between">
                            <View className="items-center p-4 bg-blue-50 rounded-lg flex-1 mr-4">
                                <Text className="text-2xl font-bold text-blue-500 mb-2">{accountCount}</Text>
                                <Text className="text-sm text-gray-600">Cuentas</Text>
                            </View>
                            <View className="items-center p-4 bg-green-50 rounded-lg flex-1">
                                <Text className="text-2xl font-bold text-green-500 mb-2">
                                    ${totalBalance.toFixed(2)}
                                </Text>
                                <Text className="text-sm text-gray-600">Balance Total</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </AuthGuard>
    );
} 