import { useQuery } from '@tanstack/react-query';
import { accountApi } from './api/account.api';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import CreateAccountModal from './components/CreateAccountModal';

export default function AccountList() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: accounts, isLoading, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountApi.getAccounts,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading accounts</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
                    <p className="text-gray-500 mt-1">Manage your savings and checking accounts</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Account
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {accounts?.map((account) => (
                    <Link
                        key={account.id}
                        to={`/accounts/${account.id}`}
                        className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition" />
                            </div>

                            <h3 className="font-semibold text-gray-900">{account.user?.name || 'Account'}</h3>
                            <p className="text-sm text-gray-500 mb-4 capitalize">Checking</p>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 rounded-b-xl">
                            <p className="text-xs text-gray-500">
                                Created {new Date(account.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <CreateAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
