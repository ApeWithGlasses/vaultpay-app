import { ENDPOINTS } from '../config/env';
import { tokenService } from './tokenService';

export const login = async (email, password) => {
    try {
        console.log('Intentando login con:', { username: email, url: ENDPOINTS.LOGIN });
        
        const response = await fetch(ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: email,
                password 
            }),
        });

        if (!response.ok) {
            try {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
                throw new Error(`Error en el inicio de sesión: Verifica tus credenciales`);
            } catch (e) {
                throw new Error(`Error en el inicio de sesión: Verifica tus credenciales`);
            }
        }

        const authHeader = response.headers.get('Authorization');
        console.log('Auth header:', authHeader);
        
        if (!authHeader) {
            throw new Error('No se recibió el token de acceso en los headers');
        }

        const token = authHeader.replace('Bearer ', '');
        await tokenService.setToken(token);

        return { success: true };
    } catch (error) {
        console.error('Error completo en login:', error);
        throw error;
    }
};

export const logout = async () => {
    await tokenService.removeToken();
};

export const isAuthenticated = async () => {
    const token = await tokenService.getToken();
    return !!token;
}; 