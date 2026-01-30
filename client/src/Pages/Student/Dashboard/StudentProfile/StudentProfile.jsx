import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= HELPERS ================= */
const extractUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.url) return val.url;
    return "";
};

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH PROFILE ================= */
    const fetchProfile = async () => {
        try {
            const res = await axios.get(
                `${BACKEND_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setUser(res.data.user);
            setFormData({
                fullName: res.data.user.fullName || "",
                phone: res.data.user.phone || "",
                address: res.data.user.address || "",
                about: res.data.user.about || "",
                skills: res.data.user.skills?.join(", ") || "",
            });
        } catch (err) {
            console.error("Fetch profile error:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            if (profileImage) {
                data.append("profileImage", profileImage);
            }

            await axios.put(
                `${BACKEND_URL}/api/auth/profile`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setEditMode(false);
            setProfileImage(null);
            fetchProfile();
        } catch (err) {
            console.error("Update profile error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>Loading profile...</p>;

    /* ================= VIEW MODE ================= */
    if (!editMode) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-4">
                    <img
                        src={extractUrl(user.profileImage) || "/avatar.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user.fullName}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>About:</strong> {user.about || "—"}</p>
                    <p>
                        <strong>Skills:</strong>{" "}
                        {user.skills?.length ? user.skills.join(", ") : "—"}
                    </p>
                </div>

                <button
                    onClick={() => setEditMode(true)}
                    className="mt-6 px-5 py-2 bg-black text-white rounded-lg"
                >
                    Edit Profile
                </button>
            </div>
        );
    }

    /* ================= EDIT MODE ================= */
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                />

                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full border p-2 rounded"
                />

                <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="About"
                    className="w-full border p-2 rounded"
                />

                <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 bg-gray-300 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfile;
u