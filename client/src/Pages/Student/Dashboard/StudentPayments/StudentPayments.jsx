import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  X,
  Copy,
  Check,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= CONFIG ================= */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentPayments = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedInvoice, setCopiedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PAYMENTS ================= */
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/enrollments`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const mapped = data.enrollments.map((e) => {
          const courseTitle = e.course?.title || "Course Removed";
          const courseThumbnail =
            e.course?.thumbnail?.url ||
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300";

          return {
            id: e.receipt?.receiptNumber || e._id,
            rawId: e._id,
            courseTitle,
            courseThumbnail,
            amount: e.amount || 0,
            status:
              e.paymentStatus === "PAID"
                ? "paid"
                : e.paymentStatus === "LATER"
                ? "pending"
                : "failed",
            receiptUrl: e.receipt?.url || null,
          };
        });

        setPaymentData(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  /* ================= HELPERS ================= */
  const handleCopyInvoiceId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedInvoice(id);
    setTimeout(() => setCopiedInvoice(null), 2000);
    toast.success("Receipt number copied");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading payments...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Payments & Receipts</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentData.map((payment) => (
          <div
            key={payment.rawId}
            className="bg-white p-5 rounded-xl shadow"
          >
            <img
              src={payment.courseThumbnail}
              alt=""
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h3 className="font-bold text-lg">{payment.courseTitle}</h3>

            <div className="flex justify-between items-center mt-4">
              <p className="text-xl font-bold">₹{payment.amount}</p>
              {getStatusBadge(payment.status)}
            </div>

            {/* VIEW RECEIPT (PDF) */}
            {payment.receiptUrl && (
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Receipt
              </a>
            )}

            {/* COPY RECEIPT NUMBER */}
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

      {/* ================= OPTIONAL MODAL (INFO ONLY) ================= */}
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
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Receipt Info</h2>
                <button onClick={() => setSelectedInvoice(null)}>
                  <X />
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Receipts are opened as secure PDF files in a new tab.
              </p>

              <a
                href={selectedInvoice.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Open PDF
              </a>

              <a
                href={selectedInvoice.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full bg-gray-100 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentPayments;
