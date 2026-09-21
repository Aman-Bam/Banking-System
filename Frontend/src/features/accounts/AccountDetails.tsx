import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accountApi } from './api/account.api';
import { transactionApi } from '../transactions/api/transaction.api';
import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AccountDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: account, isLoading, error } = useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApi.getAccount(id!),
        enabled: !!id,
    });

    const { data: transactions, isLoading: isTxLoading } = useQuery({
        queryKey: ['account-transactions', id],
        queryFn: async () => {
            const allTx = await transactionApi.getTransactions();
            return allTx.filter(tx => tx.fromAccountId === id || tx.toAccountId === id);
        },
        enabled: !!id,
    });

    if (isLoading) return (
        <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !account) return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Account not found or failed to load</p>
            <Link to="/accounts" className="text-blue-600 hover:underline">Back to Accounts</Link>
        </div>
    );

    const accountName = account.userName || account.user?.name || 'Bank Account';
    const accountId = account.id || account._id || id;
    const currency = account.currency || 'INR';
    const currencySymbol = currency === 'INR' ? '₹' : '$';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/accounts" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="h-6 w-6 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{accountName}</h1>
                    <p className="text-gray-500 text-sm flex items-center space-x-2">
                        <span className="capitalize">Checking Account</span>
                        <span>•</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{accountId}</span>
                    </p>
                </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
                <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold">
                    {currencySymbol}{Number(account.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <div className="mt-6 flex space-x-8">
                    <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Currency</p>
                        <p className="font-medium">{currency}</p>
                    </div>
                    <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Status</p>
                        <p className="font-medium flex items-center capitalize">
                            <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                            {(account.status || 'ACTIVE').toLowerCase()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                    <Link to="/transfer" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        + New Transfer
                    </Link>
                </div>

                {isTxLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading transactions...</div>
                ) : !transactions || transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No transactions found for this account.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {transactions.map((tx) => {
                            const isCredit = tx.toAccountId === id;
                            return (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-full ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCredit ? '+' : '-'}{currencySymbol}{Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                                            {(tx.status || 'COMPLETED').toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
