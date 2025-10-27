import api from './api';

const BASE_URL = '/medidas';

export const getAllMedidas = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar medidas:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {object} medidaData
 */
export const createMedida = async (medidaData) => {
    try {
        const response = await api.post(BASE_URL, medidaData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar medida:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {number} id 
 * @param {object} medidaData 
 */
export const updateMedida = async (id, medidaData) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, medidaData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar medida:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * @param {number} id 
 */
export const deleteMedida = async (id) => {
    try {
        await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir medida:", error.response?.data || error.message);
        throw error;
    }
};