import { useQuery } from '@tanstack/react-query';
import { Search, Filter, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AuditLogEntry {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    resourceId?: string;
    details: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

const fetchAuditLogs = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
        { id: 'aud_1', action: 'LOGIN_SUCCESS', user: 'user@example.com', timestamp: new Date().toISOString(), details: 'User logged in successfully', severity: 'INFO' },
        { id: 'aud_2', action: 'TRANSACTION_CREATED', user: 'user@example.com', timestamp: new Date(Date.now() - 3600000).toISOString(), resourceId: 'tx_123', details: 'Transferred $500.00 to Savings', severity: 'INFO' },
        { id: 'aud_3', action: 'FAILED_LOGIN', user: 'unknown', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Invalid password attempt', severity: 'WARNING' },
        { id: 'aud_4', action: 'ACCOUNT_CREATED', user: 'admin', timestamp: new Date(Date.now() - 86400000).toISOString(), resourceId: 'acc_3', details: 'Created Emergency Fund account', severity: 'INFO' },
    ] as AuditLogEntry[];
};

export default function AuditLog() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: fetchAuditLogs
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500">Security and activity tracking</p>
                </div>

                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading logs...</div>
                    ) : logs?.map((log) => (
                        <li key={log.id} className="p-4 hover:bg-gray-50 transition">
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    {log.severity === 'CRITICAL' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                    {log.severity === 'WARNING' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                    {log.severity === 'INFO' && <Info className="h-5 w-5 text-blue-500" />}
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
                                        <span>User: {log.user}</span>
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
                    ))}
                </ul>
            </div>
        </div>
    );
}
