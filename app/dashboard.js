import { View, Text, Pressable, ActivityIndicator, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { DropdownMenu } from '../components/DropdownMenu';
import { logout } from '../services/authService';
import { userService } from '../services/userService';
import { tokenService } from '../services/tokenService';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [newBalance, setNewBalance] = useState('');
    const [createAccountModal, setCreateAccountModal] = useState(false);
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [initialBalance, setInitialBalance] = useState('');

    const loadUserData = async () => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                throw new Error('No hay token de acceso');
            }
            console.log('Token obtenido:', token);

            const tokenData = JSON.parse(atob(token.split('.')[1]));
            console.log('Email del usuario:', tokenData.sub);

            const userData = await userService.getUserByEmail(tokenData.sub);
            console.log('Datos del usuario:', userData);
            setUser(userData);

            const accountsData = await userService.getUserAccounts(userData.id);
            console.log('Cuentas del usuario:', accountsData);
            setAccounts(accountsData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            Alert.alert('Error', error.message || 'Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const handleProfilePress = () => {
        router.push('/profile');
    };

    const handleSettingsPress = () => {
        console.log('Ir a configuración');
    };

    const handleUpdateBalance = async () => {
        try {
            await userService.updateAccountBalance(selectedAccount.accountNumber, parseFloat(newBalance));
            setModalVisible(false);
            setNewBalance('');
            loadUserData(); // Recargar los datos
            Alert.alert('Éxito', 'Balance actualizado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el balance');
        }
    };

    const handleDeleteAccount = async (accountId) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta cuenta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await userService.deleteAccount(accountId);
                            loadUserData();
                            Alert.alert('Éxito', 'Cuenta eliminada correctamente');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la cuenta');
                        }
                    }
                }
            ]
        );
    };

    const handleCreateAccount = async () => {
        try {
            if (!newAccountNumber || !initialBalance) {
                Alert.alert('Error', 'Por favor completa todos los campos');
                return;
            }

            const accountData = {
                accountNumber: newAccountNumber,
                initialBalance: parseFloat(initialBalance)
            };

            await userService.registerAccount(user.id, accountData);
            setCreateAccountModal(false);
            setNewAccountNumber('');
            setInitialBalance('');
            loadUserData();
            Alert.alert('Éxito', 'Cuenta creada correctamente');
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <AuthGuard>
            <ScrollView className="flex-1 bg-white">
                <View className="bg-blue-500 p-6 rounded-b-3xl shadow-lg">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-2xl font-bold text-white mb-2">
                                ¡Bienvenido, {user?.name}!
                            </Text>
                            <Text className="text-blue-100">{user?.email}</Text>
                        </View>
                        <DropdownMenu 
                            onLogout={handleLogout}
                            onProfilePress={handleProfilePress}
                            onSettingsPress={handleSettingsPress}
                        />
                    </View>

                    <View className="mt-8 bg-white/10 rounded-xl p-4">
                        <Text className="text-white text-lg mb-2">Balance Total</Text>
                        <Text className="text-white text-3xl font-bold">
                            ${accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)}
                        </Text>
                        <Text className="text-blue-100 mt-2">
                            {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'} registradas
                        </Text>
                    </View>
                </View>

                <View className="p-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-semibold text-gray-800">Tus Cuentas</Text>
                        <Pressable
                            onPress={() => setCreateAccountModal(true)}
                            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
                        >
                            <Ionicons name="add" size={20} color="white" />
                            <Text className="text-white ml-1">Nueva Cuenta</Text>
                        </Pressable>
                    </View>

                    {accounts.length === 0 ? (
                        <View className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center justify-center bg-gray-50">
                            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
                            <Text className="text-gray-600 text-lg mt-4 mb-6 text-center">
                                Comienza agregando tu primera cuenta bancaria
                            </Text>
                            <Pressable
                                onPress={() => setCreateAccountModal(true)}
                                className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
                            >
                                <Ionicons name="add-circle-outline" size={24} color="white" />
                                <Text className="text-white font-semibold ml-2">Crear Nueva Cuenta</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View>
                            {accounts.map(account => (
                                <View key={account.id} className="bg-white rounded-xl shadow-md p-4 mb-4">
                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-lg font-semibold text-gray-800">{account.accountNumber}</Text>
                                            <Text className="text-2xl font-bold text-blue-500 mt-1">
                                                ${account.balance.toFixed(2)}
                                            </Text>
                                        </View>
                                        <View className="flex-row">
                                            <Pressable
                                                onPress={() => {
                                                    setSelectedAccount(account);
                                                    setNewBalance(account.balance.toString());
                                                    setModalVisible(true);
                                                }}
                                                className="bg-blue-100 p-3 rounded-full mr-3"
                                            >
                                                <Ionicons name="pencil" size={20} color="#3B82F6" />
                                            </Pressable>
                                            <Pressable
                                                onPress={() => handleDeleteAccount(account.id)}
                                                className="bg-red-100 p-3 rounded-full"
                                            >
                                                <Ionicons name="trash" size={20} color="#EF4444" />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-6 rounded-xl w-[80%]">
                            <Text className="text-xl font-semibold mb-4">Editar Balance</Text>
                            <TextInput
                                className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg text-base bg-white"
                                placeholder="Nuevo balance"
                                value={newBalance}
                                onChangeText={setNewBalance}
                                keyboardType="numeric"
                            />
                            <View className="flex-row justify-end">
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    className="bg-gray-100 px-4 py-2 rounded-lg mr-2"
                                >
                                    <Text className="text-gray-600">Cancelar</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleUpdateBalance}
                                    className="bg-blue-500 px-4 py-2 rounded-lg"
                                >
                                    <Text className="text-white">Guardar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={createAccountModal}
                    onRequestClose={() => setCreateAccountModal(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-6 rounded-xl w-[80%]">
                            <Text className="text-xl font-semibold mb-4">Crear Nueva Cuenta</Text>
                            <TextInput
                                className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base bg-white"
                                placeholder="Número de cuenta"
                                value={newAccountNumber}
                                onChangeText={setNewAccountNumber}
                            />
                            <TextInput
                                className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg text-base bg-white"
                                placeholder="Balance inicial"
                                value={initialBalance}
                                onChangeText={setInitialBalance}
                                keyboardType="numeric"
                            />
                            <View className="flex-row justify-end">
                                <Pressable
                                    onPress={() => {
                                        setCreateAccountModal(false);
                                        setNewAccountNumber('');
                                        setInitialBalance('');
                                    }}
                                    className="bg-gray-100 px-4 py-2 rounded-lg mr-2"
                                >
                                    <Text className="text-gray-600">Cancelar</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleCreateAccount}
                                    className="bg-blue-500 px-4 py-2 rounded-lg"
                                >
                                    <Text className="text-white">Crear</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </AuthGuard>
    );
} 