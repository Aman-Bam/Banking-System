import api from './axios';

export const reconcileAccount = async (accountId) => {
    const response = await api.get(`/admin/reconcile/${accountId}`);
    return response.data;
};
