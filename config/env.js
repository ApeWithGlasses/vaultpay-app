export const API_URL = 'http://192.168.78.131:8080/api';

export const ENDPOINTS = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/users/register`,
    GET_USER_BY_EMAIL: `${API_URL}/users/email`,
    GET_USER_ACCOUNTS: `${API_URL}/accounts`,
    UPDATE_ACCOUNT_BALANCE: `${API_URL}/accounts/update`,
    DELETE_ACCOUNT: `${API_URL}/accounts/delete`,
    REGISTER_ACCOUNT: `${API_URL}/accounts/register`,
    UPDATE_USER: `${API_URL}/users`,
}; 