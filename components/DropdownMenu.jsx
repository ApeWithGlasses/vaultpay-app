import React, { useState } from 'react';
import { View, Text, Pressable, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DropdownMenu({ onLogout, onProfilePress, onSettingsPress }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View className="relative">
            <TouchableOpacity 
                onPress={toggleMenu}
                className="flex-row items-center bg-blue-500 px-4 py-2 rounded-lg"
            >
                <Ionicons name="person-circle-outline" size={24} color="white" />
                <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="white" 
                    className="ml-2"
                />
            </TouchableOpacity>

            {isOpen && (
                <View className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <TouchableOpacity 
                        className="px-4 py-3 flex-row items-center"
                        onPress={() => {
                            onProfilePress();
                            setIsOpen(false);
                        }}
                    >
                        <Ionicons name="person-outline" size={20} color="#4B5563" />
                        <Text className="ml-3 text-gray-700">Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="px-4 py-3 flex-row items-center"
                        onPress={() => {
                            onSettingsPress();
                            setIsOpen(false);
                        }}
                    >
                        <Ionicons name="settings-outline" size={20} color="#4B5563" />
                        <Text className="ml-3 text-gray-700">Configuración</Text>
                    </TouchableOpacity>

                    <View className="h-[1px] bg-gray-200 my-1" />

                    <TouchableOpacity 
                        className="px-4 py-3 flex-row items-center"
                        onPress={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text className="ml-3 text-red-500">Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
} 