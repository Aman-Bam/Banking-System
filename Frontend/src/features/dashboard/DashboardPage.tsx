import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api/dashboard.api';
import { useAuthStore } from '../../store/auth.store';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Activity } from 'lucide-react';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardApi.getSummary,
    });

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    Failed to load dashboard data. Please try again.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'User'}
                </h1>
                <div className="text-sm text-gray-500">
                    Last login: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Balance */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                        <Wallet className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${data?.totalBalance.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
                </div>

                {/* Total Accounts */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-500">Active Accounts</h3>
                        <CreditCard className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data?.totalAccounts}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        <Link to="/accounts" className="text-blue-600 hover:underline">View details</Link>
                    </p>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-500">System Status</h3>
                        <Activity className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex items-center mt-1">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${data?.systemStatus === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-lg font-medium text-gray-900 capitalize">{data?.systemStatus}</span>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                    <Link to="/transactions" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {data?.recentTransactions.map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{tx.description}</p>
                                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-medium ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                            </div>
                        </div>
                    ))}
                    {data?.recentTransactions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No recent transactions</div>
                    )}
                </div>
            </div>
        </div>
    );
}
