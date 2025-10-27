import api from './api';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string>} 
 */
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data.token;
    } catch (error) {
        console.error("Erro no serviço de login:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Usuário ou senha inválidos.');
    }
};

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>} 
 */
export const registerUser = async (username, email, password) => {
    try {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Erro no serviço de registro:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Falha ao registrar.');
    }
};