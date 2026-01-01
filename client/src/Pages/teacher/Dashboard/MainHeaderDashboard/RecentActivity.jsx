import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    UserPlus,
    FileText,
    MessageSquare,
    Star,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const activities = [
    {
        id: 1,
        type: "enroll",
        message: "Rahul enrolled in React Mastery",
        time: "2 hours ago",
    },
    {
        id: 2,
        type: "assignment",
        message: "Anita submitted assignment in Node.js Backend",
        time: "4 hours ago",
    },
    {
        id: 3,
        type: "question",
        message: "Vikas asked a question in Full Stack MERN",
        time: "6 hours ago",
    },
    {
        id: 4,
        type: "review",
        message: "Sneha left a 5⭐ review on React Mastery",
        time: "1 day ago",
    },
];

const activityIcon = {
    enroll: <UserPlus className="w-5 h-5 text-green-600" />,
    assignment: <FileText className="w-5 h-5 text-blue-600" />,
    question: <MessageSquare className="w-5 h-5 text-indigo-600" />,
    review: <Star className="w-5 h-5 text-yellow-500" />,
};

const RecentActivity = () => {
    const handleClick = (activity) => {
        toast.success(activity.message, {
            autoClose: 2500,
            position: "top-right",
        });
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">
                    Recent Student Activity
                </h2>
                <p className="text-sm text-gray-500">
                    Live updates from your courses
                </p>
            </motion.div>

            {/* Activity List */}
            <div className="bg-white rounded-xl shadow-md border">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleClick(activity)}
                        className="flex items-start gap-4 p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                    >
                        {/* Icon */}
                        <div className="p-2 bg-gray-100 rounded-full">
                            {activityIcon[activity.type]}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm md:text-base">
                                {activity.message}
                            </p>
                            <span className="text-xs text-gray-400">
                                {activity.time}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
