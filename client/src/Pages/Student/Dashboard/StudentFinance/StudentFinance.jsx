import React, { useState } from 'react';
import {
    Wallet,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Download,
    Calendar,
    CreditCard,
    FileText,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';

const StudentFinance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Sample data
    const feeOverview = {
        totalFee: 45000,
        paid: 30000,
        due: 15000
    };

    const upcomingPayment = {
        amount: 15000,
        dueDate: '2026-02-15',
        description: 'Semester 2 Tuition Fee',
        status: 'pending'
    };

    const paymentHistory = [
        {
            id: 'INV-2026-001',
            date: '2026-01-05',
            description: 'Semester 1 Tuition Fee',
            amount: 15000,
            status: 'completed',
            method: 'Credit Card',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-015',
            date: '2025-12-10',
            description: 'Library Fee',
            amount: 500,
            status: 'completed',
            method: 'Debit Card',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-012',
            date: '2025-11-20',
            description: 'Lab Fee',
            amount: 2500,
            status: 'completed',
            method: 'Bank Transfer',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-008',
            date: '2025-10-15',
            description: 'Registration Fee',
            amount: 1000,
            status: 'completed',
            method: 'Credit Card',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-005',
            date: '2025-09-05',
            description: 'Admission Fee',
            amount: 5000,
            status: 'completed',
            method: 'Bank Transfer',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-003',
            date: '2025-08-20',
            description: 'Sports Fee',
            amount: 1500,
            status: 'completed',
            method: 'UPI',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-002',
            date: '2025-08-10',
            description: 'Development Fee',
            amount: 3000,
            status: 'completed',
            method: 'Credit Card',
            invoiceUrl: '#'
        },
        {
            id: 'INV-2025-001',
            date: '2025-07-25',
            description: 'Annual Subscription',
            amount: 1500,
            status: 'completed',
            method: 'Debit Card',
            invoiceUrl: '#'
        }
    ];

    const filteredPayments = paymentHistory.filter(payment => {
        const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const downloadInvoice = (invoiceId) => {
        alert(`Downloading invoice ${invoiceId}...`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'overdue':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Finance</h1>
                        <p className="text-gray-600 mt-1">Manage your fees and payment history</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Academic Year 2025-26</span>
                    </div>
                </div>

                {/* Fee Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Total Fee Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Fee</p>
                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(feeOverview.totalFee)}</p>
                                <p className="text-xs text-gray-500 mt-2">Annual tuition and fees</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Wallet className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Paid Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">Paid</p>
                                <p className="text-3xl font-bold text-green-600">{formatCurrency(feeOverview.paid)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(feeOverview.paid / feeOverview.totalFee) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                        {Math.round((feeOverview.paid / feeOverview.totalFee) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Due Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">Due</p>
                                <p className="text-3xl font-bold text-orange-600">{formatCurrency(feeOverview.due)}</p>
                                <p className="text-xs text-gray-500 mt-2">Remaining balance</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Payment Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="w-5 h-5" />
                                <h3 className="text-lg font-semibold">Upcoming Payment</h3>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold mb-2">{formatCurrency(upcomingPayment.amount)}</p>
                            <p className="text-blue-100 mb-3">{upcomingPayment.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Due Date: {formatDate(upcomingPayment.dueDate)}</span>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-md">
                            Pay Now
                        </button>
                    </div>
                </div>

                {/* Payment History Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                                <p className="text-sm text-gray-600 mt-1">View all your past transactions</p>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search payments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm w-full sm:w-64"
                                    />
                                </div>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payment History Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">{payment.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(payment.date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {payment.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {payment.method}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => downloadInvoice(payment.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Invoice
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">No payments found</p>
                                                <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Download All Button */}
                    {filteredPayments.length > 0 && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                Download All Invoices
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StudentFinance;