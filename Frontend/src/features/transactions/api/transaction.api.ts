import api from '../../../api/axios';
import { z } from 'zod';

export const transactionSchema = z.object({
    fromAccountId: z.string().min(1, 'Source account is required'),
    toAccountId: z.string().min(1, 'Destination account is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    idempotencyKey: z.string(),
}).refine(data => data.fromAccountId !== data.toAccountId, {
    message: "Cannot transfer to the same account",
    path: ["toAccountId"],
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export interface Transaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
    fromAccountName?: string;
    toAccountName?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    date: string;
}

export const transactionApi = {
    createTransaction: async (data: TransactionInput) => {
        const response = await api.post<{ message: string, transaction: Transaction }>('/transactions', {
            fromAccount: data.fromAccountId,
            toAccount: data.toAccountId,
            amount: data.amount,
            idempotencyKey: data.idempotencyKey || crypto.randomUUID() // Ensure idempotency key
        });
        return response.data.transaction;
    },

    getTransactions: async () => {
        const response = await api.get<{ transactions: any[] }>('/transactions');
        return response.data.transactions.map((tx: any) => ({
            id: tx._id,
            amount: tx.amount,
            // The backend doesn't quite return 'type' on the transaction object directly in the same way 
            // the frontend expects (CREDIT/DEBIT is on Ledger). 
            // However, the transaction object has fromAccount and toAccount.
            // We need to infer type based on the user's account? 
            // Actually, the dashboard expects a flat list of "transactions" with a type.
            // But a transfer is both a credit and debit depending on perspective.
            // For the dashboard summary, we usually show the ledger entries or we infer.
            // Let's assume for now we map it as general transaction info.
            // Wait, dashboard needs 'type'.
            // The backend `getUserTransactions` returns raw transaction documents.
            // It doesn't return Ledger entries.
            // This might be an issue for the dashboard which wants "CREDIT/DEBIT".
            // I should probably fetch Ledger entries instead?
            // Or I can calculate it: if fromAccount matches one of my accounts -> DEBIT.
            // If toAccount matches -> CREDIT.
            // But I don't know "my accounts" here easily without fetching them.
            // Let's just return the raw data and let the dashboard handle the mapping if possible,
            // or better, let's fetch Ledger entries in the backend?
            // "getUserTransactions" in backend helps.
            // Let's return the raw tx for now and fix dashboard logic.
            fromAccountId: tx.fromAccount._id || tx.fromAccount,
            fromAccountName: tx.fromAccount.name || 'Unknown Account',
            toAccountId: tx.toAccount._id || tx.toAccount,
            toAccountName: tx.toAccount.name || 'Unknown Account',
            description: `Transfer to/from ${tx.toAccount?.name || 'Account'}`, // Simplified
            status: tx.status,
            date: tx.createdAt,
            // We'll calculate 'type' and 'amount' sign in the dashboard or usage point
        }));
    }
};
