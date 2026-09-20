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
            idempotencyKey: data.idempotencyKey || crypto.randomUUID()
        });
        return response.data.transaction;
    },

    getTransactions: async () => {
        const response = await api.get<{ transactions: any[] }>('/transactions');
        return response.data.transactions.map((tx: any) => {
            const fromId = (tx.fromAccount?._id || tx.fromAccount || '').toString();
            const toId = (tx.toAccount?._id || tx.toAccount || '').toString();

            const fromName = tx.fromUserName || tx.fromAccount?.userName || tx.fromAccount?.user?.name || (fromId ? `Account (...${fromId.slice(-6)})` : 'Sender Account');
            const toName = tx.toUserName || tx.toAccount?.userName || tx.toAccount?.user?.name || (toId ? `Account (...${toId.slice(-6)})` : 'Recipient Account');

            const isInitialDeposit = fromName.toLowerCase().includes('initial deposit') || fromName.toLowerCase().includes('system');
            
            const description = isInitialDeposit
                ? `Initial Deposit to ${toName}`
                : `Transfer from ${fromName} to ${toName}`;

            return {
                id: tx._id,
                amount: tx.amount,
                fromAccountId: fromId,
                fromAccountName: fromName,
                toAccountId: toId,
                toAccountName: toName,
                description: description,
                status: tx.status,
                date: tx.createdAt,
            };
        });
    }
};
