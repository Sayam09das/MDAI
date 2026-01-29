import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const Teacherprofile = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);

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

    // ================= FETCH PROFILE =================
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = getToken();
            if (!token) return navigate("/login");

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) throw new Error();

                setCurrentUser(data.user);

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
            } catch {
                localStorage.clear();
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

            alert("Profile updated ✅");
            setIsEditing(false);
        } catch (err) {
            alert(err.message || "Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return <p>Loading profile...</p>;

    // ================= VIEW MODE =================
    if (!isEditing) {
        return (
            <div style={{ maxWidth: 800, margin: "40px auto" }}>
                <h2>Teacher Profile</h2>

                <p><b>Name:</b> {formData.fullName}</p>
                <p><b>Email:</b> {formData.email}</p>
                <p><b>Phone:</b> {formData.phone}</p>
                <p><b>Address:</b> {formData.address}</p>
                <p><b>Gender:</b> {formData.gender}</p>
                <p><b>Experience:</b> {formData.experience} years</p>

                <p><b>About:</b> {formData.about || "—"}</p>

                <p><b>Skills:</b></p>
                <div>
                    {formData.skills.length
                        ? formData.skills.map((s, i) => (
                            <span key={i} style={{ marginRight: 8 }}>
                                {s}
                            </span>
                        ))
                        : "—"}
                </div>

                {/* ===== CERTIFICATES (ALL IMAGES) ===== */}
                <h3>Certificates</h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 20,
                    }}
                >
                    <CertificateCard title="Class 10" src={formData.class10Certificate} />
                    <CertificateCard title="Class 12" src={formData.class12Certificate} />
                    <CertificateCard title="College" src={formData.collegeCertificate} />
                    <CertificateCard title="PhD / Other" src={formData.phdOrOtherCertificate} />
                </div>

                <br />
                <button onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
            </div>
        );
    }

    // ================= EDIT MODE =================
    return (
        <div style={{ maxWidth: 800, margin: "40px auto" }}>
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit}>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
                <input name="email" value={formData.email} onChange={handleChange} />
                <input name="phone" value={formData.phone} onChange={handleChange} />
                <input name="address" value={formData.address} onChange={handleChange} />

                <textarea
                    name="about"
                    value={formData.about}
                    maxLength={500}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                />

                {/* ===== SKILLS ===== */}
                <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill"
                />
                <button type="button" onClick={addSkill}>Add</button>

                <div>
                    {formData.skills.map((s, i) => (
                        <span key={i} onClick={() => removeSkill(s)} style={{ margin: 5, cursor: "pointer" }}>
                            {s} ✕
                        </span>
                    ))}
                </div>

                {/* ===== CERTIFICATES EDIT (ALL) ===== */}
                <h3>Certificates</h3>

                <CertificateEdit title="Class 10" src={formData.class10Certificate} />
                <CertificateEdit title="Class 12" src={formData.class12Certificate} />
                <CertificateEdit title="College" src={formData.collegeCertificate} />
                <CertificateEdit title="PhD / Other" src={formData.phdOrOtherCertificate} />

                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

/* ================= SMALL UI COMPONENTS ================= */

const CertificateCard = ({ title, src }) => (
    <div>
        <p><b>{title}</b></p>
        {src ? (
            <img src={src} alt={title} style={{ width: "100%", borderRadius: 8 }} />
        ) : (
            <p>—</p>
        )}
    </div>
);

const CertificateEdit = ({ title, src }) => (
    <div style={{ marginBottom: 15 }}>
        <label>{title}</label><br />
        {src && <img src={src} alt={title} width="150" style={{ display: "block" }} />}
        <input type="file" accept="image/*" />
    </div>
);

export default Teacherprofile;
