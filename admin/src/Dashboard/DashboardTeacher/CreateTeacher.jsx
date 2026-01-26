import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Save
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CreateTeacher = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: ""
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

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.length < 3) return "Minimum 3 characters";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email";
        return "";

      case "phone":
        if (!value) return "Phone required";
        return "";

      case "address":
        if (!value) return "Address required";
        return "";

      case "gender":
        if (!value) return "Gender required";
        return "";

      case "password":
        if (!value) return "Password required";
        if (value.length < 8) return "Min 8 characters";
        return "";

      case "confirmPassword":
        if (value !== formData.password)
          return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
    toast.success(`${file.name} selected`);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    ["class10Certificate", "class12Certificate", "collegeCertificate", "profileImage"]
      .forEach(f => {
        if (!files[f]) newErrors[f] = "Required";
      });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((a, c) => ({ ...a, [c]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      toast.error("Fix all errors");
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

        // SAME AS POSTMAN (TEMP URLs)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Teacher registered 🎉");
      resetForm();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      password: "",
      confirmPassword: ""
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

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer />
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-center">
          Create Teacher Account
        </h2>

        {/* INPUT */}
        {[
          { name: "fullName", icon: User, placeholder: "Full Name" },
          { name: "email", icon: Mail, placeholder: "Email" },
          { name: "phone", icon: Phone, placeholder: "Phone" },
          { name: "address", icon: MapPin, placeholder: "Address" }
        ].map(({ name, icon: Icon, placeholder }) => (
          <div key={name}>
            <div className="flex items-center border rounded-lg p-2">
              <Icon size={18} className="mr-2 text-gray-500" />
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full outline-none"
              />
            </div>
            {errors[name] && (
              <p className="text-red-500 text-sm flex gap-1">
                <AlertCircle size={14} /> {errors[name]}
              </p>
            )}
          </div>
        ))}

        {/* GENDER */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded-lg p-2"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2"
        />

        {/* FILES */}
        {[
          "class10Certificate",
          "class12Certificate",
          "collegeCertificate",
          "phdOrOtherCertificate",
          "profileImage"
        ].map(f => (
          <div key={f}>
            <input type="file" onChange={e => handleFileChange(e, f)} />
            {errors[f] && (
              <p className="text-red-500 text-sm">{errors[f]}</p>
            )}
          </div>
        ))}

        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center gap-2"
        >
          <Save size={18} />
          {isSubmitting ? "Submitting..." : "Create Teacher"}
        </button>
      </motion.form>
    </div>
  );
};

export default CreateTeacher;
