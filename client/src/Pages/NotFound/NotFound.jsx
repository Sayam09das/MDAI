import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
          You can go back to the homepage or navigate to another section.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Home size={20} />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>If you think this is a mistake, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

