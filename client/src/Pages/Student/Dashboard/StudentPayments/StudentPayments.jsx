import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Receipt,
  Calendar,
  Search,
  X,
  RefreshCw,
  Mail,
  Copy,
  Check,
  Zap,
  Wallet,
  Printer
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentPayments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedInvoice, setCopiedInvoice] = useState(null);

  const payments = [
    {
      id: "INV-2026-001",
      courseTitle: "Advanced React & Next.js Masterclass",
      courseThumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300",
      instructor: "Sarah Johnson",
      amount: 49.99,
      status: "paid",
      paymentMethod: "Visa •••• 4242",
      paymentDate: "2026-01-08",
      dueDate: "2026-01-08",
      transactionId: "TXN-987654321",
      category: "Web Development",
      items: [
        { name: "Course Access", price: 39.99 },
        { name: "Live Sessions", price: 10.0 }
      ],
      discount: 0,
      tax: 0
    }
  ];

  const [paymentData, setPaymentData] = useState(payments);

  useEffect(() => {
    toast.info("Payment Dashboard Ready 💳");
  }, []);

  const handleCopyInvoiceId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedInvoice(id);
    setTimeout(() => setCopiedInvoice(null), 2000);
    toast.success("Invoice ID copied");
  };

  const getStatusBadge = (status) => {
    if (status === "paid")
      return (
        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Paid
        </span>
      );
    if (status === "pending")
      return (
        <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    return (
      <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Failed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />

      <h1 className="text-3xl font-bold mb-6">Payments & Invoices</h1>

      {/* Payments */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentData.map((payment) => (
          <div
            key={payment.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <img
              src={payment.courseThumbnail}
              alt=""
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h3 className="font-bold text-lg">{payment.courseTitle}</h3>
            <p className="text-sm text-gray-600">{payment.instructor}</p>

            <div className="flex justify-between items-center mt-4">
              <p className="text-xl font-bold">${payment.amount}</p>
              {getStatusBadge(payment.status)}
            </div>

            <button
              onClick={() => setSelectedInvoice(payment)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Invoice
            </button>

            <button
              onClick={() => handleCopyInvoiceId(payment.id)}
              className="mt-2 w-full text-sm flex justify-center items-center gap-1 text-gray-600"
            >
              {payment.id}
              {copiedInvoice === payment.id ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedInvoice(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-xl w-full"
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-5 rounded-t-xl flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">Invoice</h2>
                  <p className="text-sm">{selectedInvoice.id}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)}>
                  <X />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold">
                    {selectedInvoice.courseTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Instructor: {selectedInvoice.instructor}
                  </p>
                </div>

                <table className="w-full text-sm mb-4">
                  <tbody>
                    {selectedInvoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-1">{item.name}</td>
                        <td className="py-1 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t pt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-gray-100 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 bg-gray-100 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="flex-1 bg-gray-100 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentPayments;
