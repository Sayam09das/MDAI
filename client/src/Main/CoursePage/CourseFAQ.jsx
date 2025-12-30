import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronDown,
    HelpCircle,
    CheckCircle,
    Clock,
    Video,
    Download,
    CreditCard,
    Shield,
    Users,
    Award,
    Globe,
    MessageCircle,
    Sparkles
} from 'lucide-react';

const CourseFAQ = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    const faqs = [
        {
            id: 1,
            category: 'Course Format',
            icon: Video,
            question: 'Is this course live or recorded?',
            answer: 'This course includes both live interactive sessions and pre-recorded video lessons. Live classes are scheduled weekly where you can interact with the instructor in real-time, ask questions, and participate in discussions. All live sessions are recorded and made available within 24 hours, so you never miss out even if you can\'t attend live.',
            iconColor: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            id: 2,
            category: 'Access',
            icon: Download,
            question: 'Will I get recordings of live classes?',
            answer: 'Yes! All live classes are automatically recorded and uploaded to your course dashboard within 24 hours. You\'ll have unlimited access to all recordings for the entire duration of your course access. You can download recordings for offline viewing and revisit any session as many times as you need.',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            id: 3,
            category: 'Pricing',
            icon: CreditCard,
            question: 'Is refund available?',
            answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with the course for any reason within the first 30 days of purchase, simply contact our support team and we\'ll process a full refund—no questions asked. This gives you ample time to explore the course content and ensure it meets your expectations.',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            id: 4,
            category: 'Access Duration',
            icon: Clock,
            question: 'How long do I have access to the course?',
            answer: 'You get lifetime access to all course materials! This includes all video lessons, downloadable resources, course updates, and future additions. Once enrolled, the course is yours forever. You can learn at your own pace without any time pressure or expiration dates.',
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            id: 5,
            category: 'Prerequisites',
            icon: Award,
            question: 'Do I need any prior experience to take this course?',
            answer: 'No prior experience required! This course is designed for complete beginners. We start from the fundamentals and gradually progress to advanced topics. Whether you\'re switching careers or just curious about the subject, our structured curriculum will guide you step-by-step.',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            id: 6,
            category: 'Certificate',
            icon: Award,
            question: 'Will I receive a certificate upon completion?',
            answer: 'Yes! You\'ll receive a verified certificate of completion once you finish the course. The certificate is shareable on LinkedIn, your resume, and other professional platforms. It includes your name, course title, completion date, and a unique verification ID that employers can authenticate.',
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            id: 7,
            category: 'Support',
            icon: MessageCircle,
            question: 'What kind of support is available during the course?',
            answer: 'You\'ll have access to multiple support channels: Q&A section for each lesson, dedicated discussion forum, direct messaging with instructors (response within 24-48 hours), weekly live Q&A sessions, and a vibrant student community. Our instructors are committed to helping you succeed.',
            iconColor: 'text-pink-600',
            bgColor: 'bg-pink-50',
        },
        {
            id: 8,
            category: 'Resources',
            icon: Download,
            question: 'Are course materials downloadable?',
            answer: 'Absolutely! All course materials are downloadable including video lectures (for offline viewing), PDFs, code files, worksheets, cheat sheets, and project resources. You can access everything offline and keep all materials even after course completion.',
            iconColor: 'text-teal-600',
            bgColor: 'bg-teal-50',
        },
        {
            id: 9,
            category: 'Updates',
            icon: Sparkles,
            question: 'Will the course be updated with new content?',
            answer: 'Yes! We regularly update our courses to keep them current with industry trends and best practices. All updates are free for enrolled students—you\'ll get lifetime access to both current and future content additions at no extra cost.',
            iconColor: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            id: 10,
            category: 'Accessibility',
            icon: Globe,
            question: 'Can I access the course from any device?',
            answer: 'Yes! Our platform is fully responsive and works seamlessly on desktop, laptop, tablet, and mobile devices. You can switch between devices and pick up right where you left off. Your progress syncs automatically across all devices.',
            iconColor: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
        },
        {
            id: 11,
            category: 'Payment',
            icon: Shield,
            question: 'Is the payment secure?',
            answer: 'Absolutely! We use industry-standard SSL encryption and partner with trusted payment processors (Stripe, PayPal) to ensure your payment information is completely secure. We never store your credit card details on our servers.',
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            id: 12,
            category: 'Community',
            icon: Users,
            question: 'Will I have access to a student community?',
            answer: 'Yes! You\'ll join an active community of fellow learners where you can network, collaborate on projects, share experiences, and get peer support. Our Discord/Slack community is moderated by course staff and remains accessible throughout your learning journey.',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = [...new Set(faqs.map(faq => faq.category))];

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Got Questions?</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Frequently Asked <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about this course
                    </p>
                </div>

                {/* Search Bar */}
                <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md text-gray-900 placeholder-gray-400"
                        />
                        <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => {
                        const Icon = faq.icon;
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={faq.id}
                                className={`group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* Question Header */}
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`${faq.bgColor} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transform transition-all duration-300 ${isOpen ? 'scale-110 rotate-6' : ''
                                            }`}>
                                            <Icon className={`w-6 h-6 ${faq.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                {faq.category}
                                            </div>
                                            <h3 className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'
                                                }`}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-6 h-6 text-gray-500 flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''
                                        }`} />
                                </button>

                                {/* Answer Content */}
                                <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="px-6 pb-6 pl-[88px]">
                                        <div className="pt-2 border-t border-gray-200">
                                            <p className="text-gray-700 leading-relaxed mt-4">
                                                {faq.answer}
                                            </p>

                                            {/* Check icon */}
                                            <div className="flex items-center space-x-2 mt-4 text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="font-semibold">Verified Answer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Results Message */}
                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600 mb-4">
                            Try searching with different keywords
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Still Have Questions */}
                <div className={`mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                                Contact Support
                            </button>
                            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                                Join Community
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {[
                        { icon: CheckCircle, value: '24/7', label: 'Support' },
                        { icon: Users, value: '10K+', label: 'Students' },
                        { icon: Award, value: '4.9', label: 'Rating' },
                        { icon: MessageCircle, value: '<2h', label: 'Response' },
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <Icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseFAQ;