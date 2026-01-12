import React from "react";
import { useParams } from "react-router-dom";

const Payment = () => {
    const { courseId } = useParams();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Payment Page</h1>
            <p>Course ID: {courseId}</p>
            <p>Payment gateway integration coming soon 🚀</p>
        </div>
    );
};

export default Payment;
