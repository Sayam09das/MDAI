import React from "react";

const ReturnTeacherMessages = () => {
const Messages = React.lazy(() => import("./TeacherMessages"));
  
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

export default ReturnTeacherMessages;

