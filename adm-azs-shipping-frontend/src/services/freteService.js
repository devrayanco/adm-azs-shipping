import api from './api';

const BASE_URL = '/fretes';

/**
 * @param {object} params 
 */

export const getFretes = async (params) => {
    try {
        const response = await api.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar fretes:", error.response?.data || error.message);
        throw error;
    }
};

export const getFreteById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar frete ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {object} freteData
 */
export const createFrete = async (freteData) => {
    try {
        const response = await api.post(BASE_URL, freteData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar frete:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {number} id 
 * @param {object} freteData 
 */
export const updateFrete = async (id, freteData) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, freteData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar frete ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {number} id
 */
export const deleteFrete = async (id) => {
    try {
        await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao excluir frete ${id}:`, error.response?.data || error.message);
        throw error;
    }
};