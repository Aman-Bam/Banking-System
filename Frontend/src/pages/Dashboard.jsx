import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, ArrowRightLeft, CreditCard, RefreshCw } from 'lucide-react';
import * as accountApi from '../api/account';
import * as transactionApi from '../api/transaction';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Create Account Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Transfer Modal State
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [selectedFromAccount, setSelectedFromAccount] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [transferError, setTransferError] = useState('');
    const [transferSuccess, setTransferSuccess] = useState('');

    const fetchAccounts = async () => {
        try {
            const data = await accountApi.getAccounts();
            setAccounts(data.accounts || []);
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAccounts();
    };

    const handleCreateAccount = async () => {
        setCreateLoading(true);
        try {
            await accountApi.createAccount();
            await fetchAccounts();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create account", error);
            alert("Failed to create account");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setTransferLoading(true);
        setTransferError('');
        setTransferSuccess('');

        try {
            const idempotencyKey = uuidv4();
            await transactionApi.transferFunds({
                fromAccountId: selectedFromAccount,
                toAccountId: toAccountId,
                amount: Number(amount),
                idempotencyKey
            });
            setTransferSuccess('Transfer successful!');
            setAmount('');
            setToAccountId('');
            await fetchAccounts(); // Refresh balances
            setTimeout(() => {
                setIsTransferModalOpen(false);
                setTransferSuccess('');
            }, 2000);

        } catch (error) {
            setTransferError(error.response?.data?.message || 'Transfer failed');
        } finally {
            setTransferLoading(false);
        }
    };

    const openTransferModal = (accountId) => {
        setSelectedFromAccount(accountId);
        setIsTransferModalOpen(true);
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Accounts</h1>
                        <p className="text-white/60">Manage your balances and transactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleRefresh}
                            className="!w-auto !px-4"
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="!w-auto shadow-lg shadow-blue-500/30"
                        >
                            <Plus className="w-5 h-5" /> New Account
                        </Button>
                    </div>
                </div>

                {/* Accounts Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse"></div>
                        ))}
                    </div>
                ) : accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account) => (
                            <Card key={account._id} className="relative overflow-hidden group hover:bg-white/10 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CreditCard className="w-24 h-24" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${account.status === 'ACTIVE'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {account.status}
                                            </span>
                                            <span className="text-xs text-white/40 font-mono tracking-wider">
                                                {account.currency}
                                            </span>
                                        </div>

                                        <h3 className="text-white/60 text-sm mb-1">Available Balance</h3>
                                        <div className="text-4xl font-bold text-white mb-6 tracking-tight">
                                            {/* Format currency */}
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: account.currency }).format(account.balance)}
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-white/40 uppercase tracking-widest">Account ID</p>
                                            <p className="font-mono text-sm text-white/80 select-all">{account._id}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <Button
                                            variant="secondary"
                                            onClick={() => openTransferModal(account._id)}
                                            className="w-full group-hover:bg-white/20"
                                        >
                                            <ArrowRightLeft className="w-4 h-4" /> Transfer Funds
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No Accounts Yet</h3>
                        <p className="text-white/50 max-w-sm mx-auto mb-8">
                            Open your first bank account to start managing your funds securely.
                        </p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="!w-auto !px-8"
                        >
                            Open Account
                        </Button>
                    </div>
                )}

                {/* Create Account Modal */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Open New Account"
                >
                    <div className="space-y-6">
                        <p className="text-white/70">
                            Are you sure you want to open a new savings account? It will be activated immediately.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="!w-auto bg-transparent border border-white/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateAccount}
                                disabled={createLoading}
                                className="!w-auto"
                            >
                                {createLoading ? 'Creating...' : 'Confirm & Create'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Transfer Funds Modal */}
                <Modal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    title="Transfer Funds"
                >
                    <form onSubmit={handleTransfer} className="space-y-4">
                        {transferError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                                {transferError}
                            </div>
                        )}
                        {transferSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-lg text-sm">
                                {transferSuccess}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1 ml-1">From Account</label>
                            <select
                                value={selectedFromAccount}
                                onChange={(e) => setSelectedFromAccount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                            >
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id} className="bg-slate-800">
                                        {acc._id} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: acc.currency }).format(acc.balance)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="To Account ID"
                            value={toAccountId}
                            onChange={(e) => setToAccountId(e.target.value)}
                            placeholder="Enter Recipient Account ID"
                            required
                        />

                        <Input
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            min="0.01"
                            step="0.01"
                        />

                        <div className="pt-2">
                            <Button type="submit" disabled={transferLoading || !amount || !toAccountId}>
                                {transferLoading ? 'Processing...' : 'Send Money'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Dashboard;
