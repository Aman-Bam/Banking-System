import api from '../../../api/axios';
import { z } from 'zod';

export interface Account {
    id: string;
    balance: number; // Ensure this matches backend
    currency: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

export const createAccountSchema = z.object({
    name: z.string().min(3, 'Account name must be at least 3 characters'),
    type: z.enum(['SAVINGS', 'CHECKING']),
    initialDeposit: z.number().min(0, 'Initial deposit cannot be negative'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const accountApi = {
    getAccounts: async () => {
        const response = await api.get<{ accounts: any[] }>('/accounts');
        return response.data.accounts.map(acc => ({
            ...acc,
            id: acc._id || acc.id,
            user: acc.user // Pass through populated user
        })) as Account[];
    },

    getAccount: async (id: string) => {
        // Fetch all accounts and find the one matching the ID
        const allAccounts = await accountApi.getAccounts();
        const account = allAccounts.find(a => a.id === id);
        if (!account) throw new Error("Account not found");
        return account;
    },

    createAccount: async (data: CreateAccountInput) => {
        const response = await api.post<{ account: Account }>('/accounts', data);
        return response.data.account;
    }
};
