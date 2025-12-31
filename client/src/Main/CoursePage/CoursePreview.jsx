import React, { useState, useEffect } from 'react'
import {
    BookOpen,
    Play,
    CheckCircle,
    Share2,
    Heart,
} from 'lucide-react'
import { toast } from "react-toastify";

const CoursePreview = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const FSD_URL = import.meta.env.VITE_FSD_URL;
    const FSD_Thumb_URL = import.meta.env.VITE_FSD_THUMB_URL;

    // ✅ Course data
    const courseData = {
        title: 'Full Stack MERN Course',
        duration: '6h 30m',
        totalLessons: 42,
        rating: 4.8,
    }

    useEffect(() => {
        setIsVisible(true)
    }, [])

    // ✅ Share handler (YouTube-style)
    const handleShare = async () => {
        const shareUrl = FSD_URL;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: courseData.title,
                    url: shareUrl,
                });
                toast.success("Course link shared successfully!");
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            toast.error("Something went wrong while sharing!");
        }
    };

    return (
        <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
        >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border">

                {/* ================= VIDEO / THUMBNAIL ================= */}
                <div className="relative aspect-video bg-black">

                    {!isPlaying ? (
                        <>
                            {/* Thumbnail */}
                            <img
                                src={FSD_Thumb_URL}
                                alt="Course Thumbnail"
                                className="w-full h-full object-cover"
                            />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition cursor-pointer"
                                >
                                    <Play className="w-12 h-12 text-red-600 ml-2" fill="currentColor" />
                                </button>
                            </div>

                            {/* Preview Badge */}
                            <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 text-white text-sm rounded-lg">
                                Course Preview
                            </div>

                            {/* Duration */}
                            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg">
                                {courseData.duration}
                            </div>
                        </>
                    ) : (
                        // 🎥 REAL YOUTUBE VIDEO
                        <iframe
                            className="w-full h-full"
                            src={FSD_URL}
                            title="Course Preview"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    )}

                    {/* Decorative Icon */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <BookOpen className="w-40 h-40 text-white opacity-10" />
                        </div>
                    )}
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Like */}
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition cursor-pointer"
                        title="Share"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* ================= COURSE STATS ================= */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="font-bold text-2xl text-indigo-600">
                                {courseData.totalLessons}
                            </div>
                            <div className="text-xs text-gray-600">Lessons</div>
                        </div>
                        <div>
                            <div className="font-bold text-2xl text-purple-600">
                                {courseData.duration}
                            </div>
                            <div className="text-xs text-gray-600">Duration</div>
                        </div>
                        <div>
                            <div className="font-bold text-2xl text-pink-600">
                                {courseData.rating}★
                            </div>
                            <div className="text-xs text-gray-600">Rating</div>
                        </div>
                    </div>
                </div>

                {/* ================= COURSE INCLUDES ================= */}
                <div className="p-6 border-t">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-600 w-5 h-5" />
                        This course includes:
                    </h4>

                    <div className="space-y-3 text-sm text-gray-700">
                        {[
                            'Lifetime access',
                            'Downloadable resources',
                            'Certificate of completion',
                            'Mobile & desktop access',
                            '30-day money-back guarantee',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CoursePreview
