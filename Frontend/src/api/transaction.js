import api from './axios';

export const transferFunds = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};
