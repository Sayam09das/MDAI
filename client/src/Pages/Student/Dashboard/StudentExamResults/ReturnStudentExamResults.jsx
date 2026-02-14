import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

const ReturnStudentExamResults = () => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate('/student-dashboard/exam-results')}
            className="cursor-pointer p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                    <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Exam Results</h3>
                    <p className="text-sm text-gray-500">View your exam results</p>
                </div>
            </div>
        </div>
    );
};

export default ReturnStudentExamResults;

