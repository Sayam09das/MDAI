import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Video, Award } from "lucide-react";

const stats = [
    { title: "Enrolled Courses", value: 5, icon: BookOpen },
    { title: "Completed Lessons", value: 42, icon: CheckCircle },
    { title: "Live Classes Today", value: 1, icon: Video },
    { title: "Certificates", value: 2, icon: Award },
];

const StudentStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl shadow p-5"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
                        </div>
                        <item.icon className="w-8 h-8 text-indigo-600" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StudentStats;
