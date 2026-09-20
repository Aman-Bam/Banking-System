import api from './axios';

export const transferFunds = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export const depositInitialFunds = async (initialFundsData) => {
    const response = await api.post('/transactions/system/initial-funds', initialFundsData);
    return response.data;
};
