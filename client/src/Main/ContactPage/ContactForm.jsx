import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  Sparkles
} from 'lucide-react';

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear submit status when user makes changes
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      // Mock success response (change to test error state)
      const isSuccess = true;

      if (isSuccess) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
      }

      setLoading(false);
    }, 2000);

    // Real API call implementation:
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   
    //   if (response.ok) {
    //     setSubmitStatus('success');
    //     setFormData({ fullName: '', email: '', subject: '', message: '' });
    //     setErrors({});
    //   } else {
    //     setSubmitStatus('error');
    //   }
    // } catch (err) {
    //   setSubmitStatus('error');
    // } finally {
    //   setLoading(false);
    // }
  };

  const fields = [
    {
      name: 'fullName',
      label: 'Full Name',
      icon: User,
      type: 'text',
      placeholder: 'John Doe',
    },
    {
      name: 'email',
      label: 'Email Address',
      icon: Mail,
      type: 'email',
      placeholder: 'john@example.com',
    },
    {
      name: 'subject',
      label: 'Subject',
      icon: MessageSquare,
      type: 'text',
      placeholder: 'How can we help you?',
    },
  ];

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Send Us a Message</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            We'd Love to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hear From You</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you as soon as possible
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start space-x-4 animate-slide-in">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-1">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-4 animate-slide-in">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">
                  Oops! Something Went Wrong
                </h3>
                <p className="text-sm text-red-700">
                  We couldn't send your message. Please try again or contact us directly.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">

            {/* Text Fields */}
            {fields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors[field.name]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-indigo-500'
                        }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors[field.name]}</span>
                    </p>
                  )}
                </div>
              );
            })}

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none ${errors.message
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-indigo-500'
                    }`}
                />
              </div>
              {errors.message && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.message}</span>
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {formData.message.length} / 500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-3">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Sending Message...</span>
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Send Message</span>
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Privacy Notice */}
            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to our{' '}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;