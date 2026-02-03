import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useCalendar } from '../../../../../context/CalendarContext';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
      );
    case 'error':
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
      );
    case 'warning':
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
      );
  }
};

const ToastItem = ({ toast, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm"
    >
      <ToastIcon type={toast.type} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
    </motion.div>
  );
};

const NotificationToast = () => {
  const { toasts, removeToast } = useCalendar();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
