import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Receipt,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  CreditCard
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= ANIMATION VARIANTS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

/* ================= MAIN COMPONENT ================= */
const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/enrollments/my-courses`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load payments");

        setPayments(data.enrollments || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error("Failed to load payments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      PAID: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Paid"
      },
      PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending"
      },
      LATER: {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: <Calendar className="w-4 h-4" />,
        label: "Pay Later"
      },
    };
    return configs[status] || configs.LATER;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-slate-600 animate-spin" />
          <p className="text-slate-700 text-lg font-medium">Loading payments...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="light"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-red-200 overflow-hidden"
            >
              <div className="bg-red-50 p-6 md:p-8">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold">Error Loading Payments</h3>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4 md:p-6 lg:p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-6 md:mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-700 p-3 rounded-xl">
                  <Receipt className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">
                  My Payments & Receipts
                </h1>
              </div>
              <p className="text-slate-600 text-sm md:text-base ml-14 md:ml-16">
                View and manage your payment history and receipts
              </p>
            </div>
          </motion.div>

          {/* Payments List */}
          {payments.length === 0 ? (
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full mb-4">
                  <CreditCard className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                  No Payments Found
                </h3>
                <p className="text-slate-600 text-sm md:text-base">
                  You haven't made any payments yet. Enroll in a course to get started!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="space-y-4 md:space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {payments.map((payment, index) => (
                  <PaymentCard
                    key={payment._id}
                    payment={payment}
                    index={index}
                    getStatusConfig={getStatusConfig}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

/* ================= PAYMENT CARD COMPONENT ================= */
const PaymentCard = ({ payment, index, getStatusConfig }) => {
  const courseTitle =
    typeof payment.course === "object" && payment.course !== null
      ? payment.course.title
      : "Course Removed";

  const statusConfig = getStatusConfig(payment.paymentStatus);

  // Format amount if available
  const amount = payment.amount || 0;
  
  // Get receipt URL from different possible locations
  const receiptUrl = payment.receipt?.url || null;
  const receiptNumber = payment.receipt?.receiptNumber || "N/A";

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-5 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Left Section - Course Info */}
          <div className="flex-1 min-w-0">
            {/* Course Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 break-words">
                {courseTitle}
              </h3>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} w-fit`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </motion.span>
            </div>

            {/* Payment Details */}
            <div className="space-y-2">
              {/* Amount */}
              {amount > 0 && (
                <div className="flex items-start gap-2 text-sm md:text-base text-slate-600">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700">Amount:</span>{" "}
                    <span className="text-slate-600">₹{amount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Receipt Number */}
              <div className="flex items-start gap-2 text-sm md:text-base text-slate-600">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Receipt No:</span>{" "}
                  <span className="text-slate-600">{receiptNumber}</span>
                </div>
              </div>

              {/* Verified Date */}
              {payment.verifiedAt && (
                <div className="flex items-start gap-2 text-sm md:text-base text-slate-600">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700">Verified On:</span>{" "}
                    <span className="text-slate-600">
                      {new Date(payment.verifiedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Enrollment Date */}
              <div className="flex items-start gap-2 text-sm md:text-base text-slate-600">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Enrolled On:</span>{" "}
                  <span className="text-slate-600">
                    {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Button */}
          <div className="flex items-center lg:justify-end">
            {payment.paymentStatus === "PAID" && receiptUrl ? (
              <motion.div className="flex gap-2">
                {/* View Receipt */}
                <motion.a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-slate-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-slate-800 transition-all w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">View Receipt</span>
                </motion.a>
                
                {/* Download Receipt */}
                <motion.a
                  href={receiptUrl}
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Download</span>
                </motion.a>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-sm md:text-base px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 w-full sm:w-auto justify-center">
                {payment.paymentStatus === "PENDING" ? (
                  <>
                    <Clock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-center sm:text-left">Payment pending verification</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="text-center sm:text-left">Receipt not available</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className={`h-1.5 ${payment.paymentStatus === "PAID" ? "bg-emerald-500" : payment.paymentStatus === "PENDING" ? "bg-amber-500" : "bg-slate-400"}`} />
    </motion.div>
  );
};

export default StudentPayments;

