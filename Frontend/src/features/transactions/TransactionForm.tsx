import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionApi, TransactionInput, transactionSchema } from './api/transaction.api';
import { accountApi } from '../../features/accounts/api/account.api';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function TransactionForm() {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountApi.getAccounts,
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TransactionInput>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            idempotencyKey: uuidv4(),
        }
    });

    const selectedAmount = watch('amount');

    // Regenerate idempotency key on mount or after success
    useEffect(() => {
        setValue('idempotencyKey', uuidv4());
    }, [setValue, successMessage]);

    const mutation = useMutation({
        mutationFn: transactionApi.createTransaction,
        onSuccess: () => {
            setSuccessMessage('Transaction processed successfully!');
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            reset({
                idempotencyKey: uuidv4(),
                amount: 0,
                description: '',
                fromAccountId: '',
                toAccountId: ''
            });
            setTimeout(() => setSuccessMessage(null), 5000);
        },
        onError: (err: any) => {
            setError(err.message || 'Transaction failed');
            // Do NOT generate new key on error to allow retry
        }
    });

    const onSubmit = (data: TransactionInput) => {
        setError(null);
        setSuccessMessage(null);
        mutation.mutate({
            ...data,
            amount: Number(data.amount)
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Transfer Funds</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                            <select
                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 ${errors.fromAccountId ? 'border-red-500' : ''}`}
                                {...register('fromAccountId')}
                            >
                                <option value="">Select Account</option>
                                {accounts?.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} (${acc.balance})
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccountId && <p className="text-sm text-red-500 mt-1">{errors.fromAccountId.message}</p>}
                        </div>

                        <div className="hidden md:flex items-center justify-center pt-6">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                            <select
                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 ${errors.toAccountId ? 'border-red-500' : ''}`}
                                {...register('toAccountId')}
                            >
                                <option value="">Select Account</option>
                                {/* For demo, allowing transfer between own accounts. In real app, might enter external ID */}
                                {accounts?.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                                <option value="external">External Account (Demo)</option>
                            </select>
                            {errors.toAccountId && <p className="text-sm text-red-500 mt-1">{errors.toAccountId.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pl-7 ${errors.amount ? 'border-red-500' : ''}`}
                                {...register('amount', { valueAsNumber: true })}
                            />
                        </div>
                        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="What's this for?"
                            {...register('description')}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Hidden Idempotency Key */}
                    <input type="hidden" {...register('idempotencyKey')} />
                    <div className="text-xs text-gray-400 font-mono">
                        Ref: {watch('idempotencyKey')}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {mutation.isPending ? (
                            <>
                                <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                                Processing Transaction...
                            </>
                        ) : (
                            `Send $${Number(selectedAmount || 0).toFixed(2)}`
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Transactions are secure and encrypted. Double entries are prevented via idempotency keys.
                    </p>
                </form>
            </div>
        </div>
    );
}
