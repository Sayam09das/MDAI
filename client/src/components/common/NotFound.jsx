import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
    >
      <h1 className="text-7xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-gray-600 text-center">
        Oops! The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Go Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
