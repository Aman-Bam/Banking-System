import api from './axios';

export const createAccount = async () => {
    const response = await api.post('/accounts');
    return response.data;
};

export const getAccounts = async () => {
    const response = await api.get('/accounts');
    return response.data;
};

export const getBalance = async (accountId) => {
    const response = await api.get(`/accounts/balance/${accountId}`);
    return response.data;
};
