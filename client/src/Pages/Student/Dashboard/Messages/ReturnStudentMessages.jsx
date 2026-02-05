import React from "react";
import { Navigate } from "react-router-dom";

const ReturnStudentMessages = () => {
  // Lazy load the Messages component
  const Messages = React.lazy(() => import("./Messages"));
  
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <Messages />
    </React.Suspense>
  );
};

export default ReturnStudentMessages;

