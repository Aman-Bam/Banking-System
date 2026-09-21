import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../transactions/api/transaction.api';
import { generateTransactionPDFReceipt } from '../../utils/pdfReceipt';
import { Download } from 'lucide-react';

export default function LedgerViewer() {
    const { data: entries, isLoading } = useQuery({
        queryKey: ['ledger'],
        queryFn: transactionApi.getTransactions
    });

    if (isLoading) return <div className="p-8 text-center">Loading ledger...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">General Ledger</h1>
                <p className="text-gray-500">Immutable record of all system transactions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Account</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Account</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {entries?.map((entry: any) => (
                                <tr key={entry.id} className="hover:bg-gray-50 font-mono text-sm">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(entry.date).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {entry.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-red-600">
                                        {entry.fromAccountName || entry.fromAccountId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-green-600">
                                        {entry.toAccountName || entry.toAccountId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-bold">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(entry.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => generateTransactionPDFReceipt({
                                                transactionId: entry.id,
                                                fromAccountName: entry.fromAccountName || entry.fromAccountId,
                                                fromAccountId: entry.fromAccountId,
                                                toAccountName: entry.toAccountName || entry.toAccountId,
                                                toAccountId: entry.toAccountId,
                                                amount: entry.amount,
                                                status: entry.status || 'COMPLETED',
                                                date: entry.date,
                                            })}
                                            className="inline-flex items-center px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition cursor-pointer"
                                        >
                                            <Download className="h-3 w-3 mr-1" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

