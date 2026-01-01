import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    UserCheck,
    CreditCard,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// 🔧 MOCK PROFILE STATUS (replace with API data)
const profileData = {
    completion: 72,
    kycVerified: false,
    bankLinked: true,
};

const ProfileStatus = () => {
    const isComplete =
        profileData.completion === 100 &&
        profileData.kycVerified &&
        profileData.bankLinked;

    // ❗ Do not render if profile is complete
    if (isComplete) return null;

    const handleCTA = (step) => {
        toast.warning(`Complete ${step} to unlock full features`, {
            autoClose: 2500,
            position: "top-right",
        });
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl shadow-md p-6"
            >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <AlertTriangle />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Complete Your Profile
                        </h3>
                        <p className="text-sm text-gray-600">
                            Finish setup to enable payouts & live classes
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Profile Completion</span>
                        <span>{profileData.completion}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profileData.completion}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full bg-indigo-600 rounded-full"
                        />
                    </div>
                </div>

                {/* Missing Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* KYC */}
                    {!profileData.kycVerified && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <UserCheck className="text-indigo-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        KYC Verification
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Verify your identity
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCTA("KYC verification")}
                                className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                            >
                                Verify
                                <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    )}

                    {/* Bank */}
                    {!profileData.bankLinked && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-green-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Bank Account
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Link bank for payouts
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCTA("bank account linking")}
                                className="flex items-center gap-1 text-green-600 font-semibold text-sm"
                            >
                                Link
                                <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileStatus;
