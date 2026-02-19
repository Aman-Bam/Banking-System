import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi, createAccountSchema, CreateAccountInput } from '../api/account.api';
import { X } from 'lucide-react';

interface CreateAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateAccountInput>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            type: 'SAVINGS',
            initialDeposit: 0
        }
    });

    const createMutation = useMutation({
        mutationFn: accountApi.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: CreateAccountInput) => {
        // Ensure initialDeposit is treated as number 
        createMutation.mutate({
            ...data,
            initialDeposit: Number(data.initialDeposit)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Create New Account</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                            type="text"
                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="e.g., Vacation Fund"
                            {...register('name')}
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        <select
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            {...register('type')}
                        >
                            <option value="SAVINGS">Savings</option>
                            <option value="CHECKING">Checking</option>
                        </select>
                        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pl-7 ${errors.initialDeposit ? 'border-red-500' : ''}`}
                                {...register('initialDeposit', { valueAsNumber: true })}
                            />
                        </div>
                        {errors.initialDeposit && <p className="text-sm text-red-500 mt-1">{errors.initialDeposit.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || createMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 flex items-center"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
