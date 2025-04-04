import { ENDPOINTS } from '../config/env';
import { tokenService } from './tokenService';

export const userService = {
    register: async (userData) => {
        try {
            const requestData = {
                name: userData.name,
                password: userData.password,
                email: userData.email
            };

            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            console.log('Respuesta del servidor:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || 'Error desconocido en el registro';
                } catch {
                    errorMessage = responseText || 'Error en el registro';
                }
                throw new Error(errorMessage);
            }

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                throw new Error('Error al procesar la respuesta del servidor');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            const response = await fetch(`${ENDPOINTS.GET_USER_BY_EMAIL}/${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener datos del usuario');
        }
    },

    getUserAccounts: async (userId) => {
        try {
            const response = await fetch(`${ENDPOINTS.GET_USER_ACCOUNTS}/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener las cuentas bancarias');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener las cuentas bancarias');
        }
    },

    updateAccountBalance: async (accountNumber, balance) => {
        try {
            const response = await fetch(`${ENDPOINTS.UPDATE_ACCOUNT_BALANCE}/${accountNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
                body: JSON.stringify(balance),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el balance');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar el balance');
        }
    },

    deleteAccount: async (accountId) => {
        try {
            const response = await fetch(`${ENDPOINTS.DELETE_ACCOUNT}/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }

            return true;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar la cuenta');
        }
    },

    registerAccount: async (userId, accountData) => {
        try {
            const response = await fetch(`${ENDPOINTS.REGISTER_ACCOUNT}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
                body: JSON.stringify(accountData),
            });

            if (!response.ok) {
                throw new Error('Error al registrar la cuenta');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Error al registrar la cuenta');
        }
    },

    updateUser: async (userData) => {
        try {
            const response = await fetch(`${ENDPOINTS.UPDATE_USER}/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await tokenService.getToken()}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos del usuario');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar los datos del usuario');
        }
    },
}; 