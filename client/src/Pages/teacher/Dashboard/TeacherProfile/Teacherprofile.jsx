import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const Teacherprofile = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "male",

        class10Certificate: "",
        class12Certificate: "",
        collegeCertificate: "",
        phdOrOtherCertificate: "",

        profileImage: "",
        joinWhatsappGroup: false,

        about: "",
        skills: [],
        experience: 0,
    });

    // ================= FETCH CURRENT TEACHER =================
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) throw new Error("Unauthorized");

                setCurrentUser(data.user);

                // ✅ PREFILL FORM FROM REGISTER DATA
                setFormData({
                    fullName: data.user.fullName || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    address: data.user.address || "",
                    gender: data.user.gender || "male",

                    class10Certificate: data.user.class10Certificate || "",
                    class12Certificate: data.user.class12Certificate || "",
                    collegeCertificate: data.user.collegeCertificate || "",
                    phdOrOtherCertificate: data.user.phdOrOtherCertificate || "",

                    profileImage: data.user.profileImage || "",
                    joinWhatsappGroup: data.user.joinWhatsappGroup || false,

                    about: data.user.about || "",
                    skills: data.user.skills || [],
                    experience: data.user.experience || 0,
                });
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addSkill = () => {
        if (
            skillInput.trim() &&
            formData.skills.length < 10 &&
            !formData.skills.includes(skillInput.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()],
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    // ================= UPDATE PROFILE =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/teacher/update/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Profile updated successfully ✅");
        } catch (err) {
            alert(err.message || "Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    // ================= UI =================
    if (!currentUser) return <p>Loading profile...</p>;

    return (
        <div style={{ maxWidth: 720, margin: "40px auto" }}>
            <h2>Teacher Profile</h2>

            <form onSubmit={handleSubmit}>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />

                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <input
                    name="class10Certificate"
                    value={formData.class10Certificate}
                    onChange={handleChange}
                    placeholder="Class 10 Certificate URL"
                />
                <input
                    name="class12Certificate"
                    value={formData.class12Certificate}
                    onChange={handleChange}
                    placeholder="Class 12 Certificate URL"
                />
                <input
                    name="collegeCertificate"
                    value={formData.collegeCertificate}
                    onChange={handleChange}
                    placeholder="College Certificate URL"
                />
                <input
                    name="phdOrOtherCertificate"
                    value={formData.phdOrOtherCertificate}
                    onChange={handleChange}
                    placeholder="PhD / Other Certificate URL"
                />

                <input
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="Profile Image URL"
                />

                <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="About (max 500 characters)"
                />

                <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    min={0}
                    onChange={handleChange}
                    placeholder="Experience (years)"
                />

                {/* ================= SKILLS ================= */}
                <div>
                    <input
                        placeholder="Type skill and click Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <button type="button" onClick={addSkill}>
                        Add Skill
                    </button>

                    <div style={{ marginTop: 10 }}>
                        {formData.skills.map((skill, i) => (
                            <span
                                key={i}
                                onClick={() => removeSkill(skill)}
                                style={{
                                    padding: "5px 10px",
                                    margin: 5,
                                    display: "inline-block",
                                    background: "#e5e7eb",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                }}
                            >
                                {skill} ✕
                            </span>
                        ))}
                    </div>
                </div>

                <label>
                    <input
                        type="checkbox"
                        name="joinWhatsappGroup"
                        checked={formData.joinWhatsappGroup}
                        onChange={handleChange}
                    />
                    Join WhatsApp Group
                </label>

                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default Teacherprofile;
