import { accountApi } from '../../accounts/api/account.api';
import { transactionApi } from '../../transactions/api/transaction.api';

export interface DashboardData {
    totalBalance: number;
    totalAccounts: number;
    recentTransactions: Transaction[];
    systemStatus: 'operational' | 'maintenance';
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    date: string;
    description: string;
}

export const dashboardApi = {
    getSummary: async () => {
        const [accounts, transactions] = await Promise.all([
            accountApi.getAccounts(),
            transactionApi.getTransactions()
        ]);

        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        const myAccountIds = new Set(accounts.map(a => a.id));

        const recentTransactions = transactions.slice(0, 10).map(tx => {
            // Determine type
            let type: 'CREDIT' | 'DEBIT' = 'DEBIT';
            if (myAccountIds.has(tx.toAccountId) && !myAccountIds.has(tx.fromAccountId)) {
                type = 'CREDIT';
            } else if (myAccountIds.has(tx.fromAccountId)) {
                type = 'DEBIT';
            } else {
                // If neither (shouldn't happen with getUserTransactions), default to something or omit
                type = 'CREDIT';
            }

            return {
                id: tx.id,
                amount: tx.amount,
                type,
                status: tx.status,
                date: tx.date,
                description: tx.description
            };
        });

        return {
            totalBalance,
            totalAccounts: accounts.length,
            recentTransactions,
            systemStatus: 'operational'
        } as DashboardData;
    }
};
