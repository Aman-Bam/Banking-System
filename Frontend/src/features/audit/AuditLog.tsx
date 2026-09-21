import { useQuery } from '@tanstack/react-query';
import { Search, Filter, AlertTriangle, Info } from 'lucide-react';
import { transactionApi } from '../transactions/api/transaction.api';
import { useState } from 'react';

export default function AuditLog() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: rawTransactions, isLoading, error } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: transactionApi.getTransactions
    });

    const logs = rawTransactions?.map((tx: any) => ({
        id: tx.id,
        action: 'TRANSACTION_COMPLETED',
        user: tx.fromAccountName || tx.fromAccountId || 'User',
        timestamp: tx.date,
        resourceId: tx.id,
        details: `Transferred ₹${tx.amount} to ${tx.toAccountName || tx.toAccountId}`,
        severity: tx.status === 'FAILED' ? 'WARNING' : 'INFO'
    })).filter(log =>
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs & Ledger History</h1>
                    <p className="text-gray-500">Security and real-time transaction activity tracking</p>
                </div>

                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search logs..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading live audit logs...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">Error loading logs</div>
                    ) : logs && logs.length > 0 ? (
                        logs.map((log) => (
                            <li key={log.id} className="p-4 hover:bg-gray-50 transition">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        {log.severity === 'WARNING' ? (
                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                        ) : (
                                            <Info className="h-5 w-5 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {log.action}
                                            </p>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                            <span>Sender: {log.user}</span>
                                            {log.resourceId && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono">Ref: {log.resourceId}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">No transaction logs recorded yet.</div>
                    )}
                </ul>
            </div>
        </div>
    );
}
