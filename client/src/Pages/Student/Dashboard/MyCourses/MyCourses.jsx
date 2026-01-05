import { motion } from "framer-motion";

const courses = [
  { title: "React Mastery", progress: 70 },
  { title: "Node.js Backend", progress: 35 },
];

const MyCourses = () => {
  return (
    <div className="space-y-5">
      {courses.map((course, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-5 rounded-xl shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full">
              <h3 className="font-semibold">{course.title}</h3>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {course.progress}% completed
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
              Continue
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MyCourses;
