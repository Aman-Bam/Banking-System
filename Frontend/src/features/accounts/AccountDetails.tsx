import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accountApi } from './api/account.api';
import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AccountDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: account, isLoading, error } = useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApi.getAccount(id!),
        enabled: !!id,
    });

    // Mock transactions for this specific account
    const { data: transactions } = useQuery({
        queryKey: ['account-transactions', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [
                { id: 'tx_1', date: '2023-10-25', description: 'Grocery Store', amount: -120.50, type: 'DEBIT', status: 'COMPLETED' },
                { id: 'tx_2', date: '2023-10-24', description: 'Salary Deposit', amount: 3500.00, type: 'CREDIT', status: 'COMPLETED' },
                { id: 'tx_3', date: '2023-10-22', description: 'Electric Bill', amount: -85.00, type: 'DEBIT', status: 'COMPLETED' },
                { id: 'tx_4', date: '2023-10-20', description: 'Transfer to Savings', amount: -500.00, type: 'DEBIT', status: 'COMPLETED' },
            ];
        },
        enabled: !!id,
    });

    if (isLoading) return <div className="p-8 text-center">Loading account details...</div>;
    if (error || !account) return <div className="p-8 text-red-500">Account not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/accounts" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="h-6 w-6 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
                    <p className="text-gray-500 text-sm flex items-center space-x-2">
                        <span className="capitalize">{account.type.toLowerCase()} Account</span>
                        <span>•</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{account.id}</span>
                    </p>
                </div>
                <div className="ml-auto">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export Statement
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
                </h2>
                <div className="mt-6 flex space-x-8">
                    <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Currency</p>
                        <p className="font-medium">{account.currency}</p>
                    </div>
                    <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Status</p>
                        <p className="font-medium flex items-center">
                            <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                            Active
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {transactions?.map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{tx.description}</p>
                                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-medium ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'CREDIT' ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                                </p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                                    {tx.status.toLowerCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
