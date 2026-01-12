import { Link } from "react-router-dom";

const AnnouncementMarquee = () => {
    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3">
            <div className="whitespace-nowrap flex animate-marquee">
                <span className="mx-10 text-sm md:text-base font-semibold">
                    🚀 We are hiring teachers! Interested in becoming a teacher?
                    <Link
                        to="/apply-teacher"
                        className="ml-2 underline font-bold hover:text-yellow-300 transition"
                    >
                        Apply here
                    </Link>
                </span>

                {/* duplicate for smooth infinite scroll */}
                <span className="mx-10 text-sm md:text-base font-semibold">
                    🚀 We are hiring teachers! Interested in becoming a teacher?
                    <Link
                        to="/apply-teacher"
                        className="ml-2 underline font-bold hover:text-yellow-300 transition"
                    >
                        Apply here
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default AnnouncementMarquee;
