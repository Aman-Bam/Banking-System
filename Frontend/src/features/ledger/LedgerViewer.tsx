import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

// Mock Ledger Data Structure
interface LedgerEntry {
    id: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    timestamp: string;
    referenceId: string;
}

const fetchLedger = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 'l1', debitAccount: 'Main Savings', creditAccount: 'Daily Checking', amount: 500.00, timestamp: new Date().toISOString(), referenceId: 'tx_123' },
        { id: 'l2', debitAccount: 'External', creditAccount: 'Main Savings', amount: 3500.00, timestamp: new Date(Date.now() - 86400000).toISOString(), referenceId: 'tx_124' },
    ] as LedgerEntry[];
};

export default function LedgerViewer() {
    const { data: entries, isLoading } = useQuery({
        queryKey: ['ledger'],
        queryFn: fetchLedger
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit Account</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Account</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {entries?.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50 font-mono text-sm">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {entry.referenceId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-red-600">
                                        {entry.debitAccount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-green-600">
                                        {entry.creditAccount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-bold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.amount)}
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
