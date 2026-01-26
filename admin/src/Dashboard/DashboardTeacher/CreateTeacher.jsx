import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Upload,
  X,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Home,
  ChevronRight,
  Save,
  UserPlus
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTeacher = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [files, setFiles] = useState({
    class10Certificate: null,
    class12Certificate: null,
    collegeCertificate: null,
    phdOrOtherCertificate: null,
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Invalid phone number (10-15 digits)';
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        return '';

      case 'gender':
        if (!value) return 'Gender is required';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validDocTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (fileType === 'profileImage') {
      if (!validImageTypes.includes(file.type)) {
        toast.error('Profile image must be JPEG or PNG');
        return;
      }
    } else {
      if (!validDocTypes.includes(file.type)) {
        toast.error('Certificate must be PDF, JPEG, or PNG');
        return;
      }
    }

    setFiles(prev => ({ ...prev, [fileType]: file }));
    toast.success(`${file.name} uploaded successfully`);
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
    toast.info('File removed');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Validate required files
    if (!files.class10Certificate) {
      newErrors.class10Certificate = 'Class 10 certificate is required';
    }
    if (!files.class12Certificate) {
      newErrors.class12Certificate = 'Class 12 certificate is required';
    }
    if (!files.collegeCertificate) {
      newErrors.collegeCertificate = 'College certificate is required';
    }
    if (!files.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,

        // TEMP URLs (same as Postman test)
        class10Certificate: "https://cdn.example.com/class10.pdf",
        class12Certificate: "https://cdn.example.com/class12.pdf",
        collegeCertificate: "https://cdn.example.com/college.pdf",
        phdOrOtherCertificate: files.phdOrOtherCertificate
          ? "https://cdn.example.com/phd.pdf"
          : null,

        profileImage: "https://cdn.example.com/profile.jpg",
        joinWhatsappGroup: true
      };

      const res = await fetch(`${BASE_URL}/api/teacher/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(data.message || "Teacher registered successfully 🎉", {
        position: "top-center",
        autoClose: 3000
      });

      resetForm();

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      password: '',
      confirmPassword: ''
    });
    setFiles({
      class10Certificate: null,
      class12Certificate: null,
      collegeCertificate: null,
      phdOrOtherCertificate: null,
      profileImage: null
    });
    setErrors({});
    setTouched({});
  };

  const FileUploadBox = ({ label, fileType, required = false, accept = ".pdf,.jpg,.jpeg,.png" }) => {
    const file = files[fileType];
    const error = errors[fileType];

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${error ? 'border-red-300 bg-red-50' :
            file ? 'border-emerald-300 bg-emerald-50' :
              'border-slate-300 hover:border-indigo-400 bg-slate-50'
          }`}>
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  {fileType === 'profileImage' ? (
                    <ImageIcon className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileType)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(e, fileType)}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, or PNG (Max 5MB)
                </p>
              </div>
            </label>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </motion.p>
        )}
      </div>
    );
  };

  const InputField = ({ icon: Icon, label, name, type = "text", required = false, ...props }) => {
    const error = errors[name];
    const isTouched = touched[name];

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${error && isTouched ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            {...props}
          />
        </div>
        {error && isTouched && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </motion.p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Teachers</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Create Teacher</span>
          </nav>

          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Teacher</h1>
              <p className="mt-1 text-slate-600">
                Add a new instructor to the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter full name"
                  required
                />

                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="teacher@example.com"
                  required
                />

                <InputField
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="1234567890"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.gender && touched.gender ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && touched.gender && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.gender}
                    </motion.p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="Enter complete address"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                  </div>
                  {errors.address && touched.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                Account Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Create strong password"
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.password && touched.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Confirm password"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Password requirements:</strong> At least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Profile Image
              </h2>

              <FileUploadBox
                label="Upload Profile Picture"
                fileType="profileImage"
                required
                accept=".jpg,.jpeg,.png"
              />
            </motion.div>

            {/* Educational Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Educational Certificates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadBox
                  label="Class 10 Certificate"
                  fileType="class10Certificate"
                  required
                />

                <FileUploadBox
                  label="Class 12 Certificate"
                  fileType="class12Certificate"
                  required
                />

                <FileUploadBox
                  label="College/University Certificate"
                  fileType="collegeCertificate"
                  required
                />

                <FileUploadBox
                  label="PhD or Other Certificates"
                  fileType="phdOrOtherCertificate"
                />
              </div>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-end"
            >
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Teacher Account
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacher;