import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Award, Download, CheckCircle, Clock, AlertCircle, ExternalLink, RefreshCw, Info, X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [eligibilityModal, setEligibilityModal] = useState({ open: false, courseId: null, data: null, loading: false });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/certificates/my-certificates");
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check eligibility for a course
  const checkEligibility = async (courseId) => {
    try {
      setEligibilityModal({ open: true, courseId, data: null, loading: true });
      const response = await api.get(`/api/certificates/eligibility/${courseId}`);
      setEligibilityModal(prev => ({ ...prev, loading: false, data: response.data }));
    } catch (error) {
      console.error("Error checking eligibility:", error);
      toast.error("Failed to load eligibility details");
      setEligibilityModal({ open: false, courseId: null, data: null, loading: false });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "issued":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "eligible":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "not_eligible":
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "issued":
        return "bg-green-100 text-green-800";
      case "eligible":
        return "bg-yellow-100 text-yellow-800";
      case "not_eligible":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "issued":
        return "Certificate Issued";
      case "eligible":
        return "Eligible";
      case "not_eligible":
        return "Not Eligible";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">
          View your earned certificates and track your progress towards completion.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Award className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h2>
          <p className="text-gray-600">
            Complete courses to earn certificates. Your earned certificates will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                {cert.thumbnail?.url ? (
                  <img
                    src={cert.thumbnail.url}
                    alt={cert.courseTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Award className="h-16 w-16 text-blue-300" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {cert.courseTitle}
                </h3>

                {/* Status */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                  {getStatusIcon(cert.status)}
                  {getStatusText(cert.status)}
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {cert.status === "issued" && (
                    <>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Certificate ID:</span>
                        <span className="font-mono text-xs">{cert.certificateId}</span>
                      </p>
                      {cert.issuedAt && (
                        <p>
                          <span className="font-medium">Issued on:</span>{" "}
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}

                  {cert.status !== "issued" && cert.reason && (
                    <p className="text-sm text-gray-500 italic">
                      {cert.reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  {cert.status === "issued" && cert.certificateUrl ? (
                    <>
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                      <a
                        href={cert.certificateUrl}
                        download={`certificate-${cert.certificateId}.pdf`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      <button
                        onClick={() => checkEligibility(cert.courseId)}
                        className="flex-none px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="View Requirements"
                      >
                        <Info className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  ) : cert.status === "eligible" ? (
                    <>
                      <button
                        onClick={() => toast.info("Certificate will be generated automatically. Please check back later.")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        Generating...
                      </button>
                      <button
                        onClick={() => checkEligibility(cert.courseId)}
                        className="flex-none px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="View Requirements"
                      >
                        <Info className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => checkEligibility(cert.courseId)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      <Info className="w-4 h-4" />
                      View Requirements
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Stats */}
      {certificates.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.filter(c => c.status === "issued").length}
                </p>
                <p className="text-sm text-gray-600">Certificates Earned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.filter(c => c.status === "eligible").length}
                </p>
                <p className="text-sm text-gray-600">Eligible</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.length}
                </p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Details Modal */}
      {eligibilityModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Certificate Requirements
                </h3>
                <button 
                  onClick={() => setEligibilityModal({ open: false, courseId: null, data: null, loading: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {eligibilityModal.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : eligibilityModal.data ? (
                <div className="space-y-4">
                  {/* Status */}
                  <div className={`p-4 rounded-lg ${
                    eligibilityModal.data.eligible ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      {eligibilityModal.data.eligible ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className={`font-semibold ${
                        eligibilityModal.data.eligible ? "text-green-700" : "text-yellow-700"
                      }`}>
                        {eligibilityModal.data.eligible ? "Eligible for Certificate!" : "Not Eligible Yet"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{eligibilityModal.data.reason}</p>
                  </div>

                  {/* Criteria */}
                  {eligibilityModal.data.criteria && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Minimum Progress</span>
                          <span className="font-medium">
                            {eligibilityModal.data.details?.progress?.current || 0}% / {eligibilityModal.data.criteria.minProgress}%
                            {eligibilityModal.data.details?.progress?.met && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
                          </span>
                        </div>
                        
                        {eligibilityModal.data.criteria.requireAssignments && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Assignments</span>
                            <span className="font-medium">
                              {eligibilityModal.data.details?.assignments?.submitted || 0} / {eligibilityModal.data.details?.assignments?.required || 0} submitted
                              {eligibilityModal.data.details?.assignments?.met && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
                            </span>
                          </div>
                        )}
                        
                        {eligibilityModal.data.criteria.requireExam && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Exam</span>
                            <span className="font-medium">
                              {eligibilityModal.data.details?.exam?.score || 0}% (need {eligibilityModal.data.criteria.passingMarks}%)
                              {eligibilityModal.data.details?.exam?.met && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {eligibilityModal.data.status === "issued" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-700 font-medium">Certificate Already Issued!</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Certificate ID: {eligibilityModal.data.certificateId}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;

