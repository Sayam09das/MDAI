import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= HELPERS ================= */

const extractUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.url) return val.url;
    return "";
};

const isPlaceholderHost = (url) => {
    try {
        const u = new URL(url);
        return u.hostname.includes("example.com");
    } catch {
        return true;
    }
};

const Teacherprofile = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [files, setFiles] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "male",

        profileImage: "",

        class10Certificate: "",
        class12Certificate: "",
        collegeCertificate: "",
        phdOrOtherCertificate: "",

        joinWhatsappGroup: false,
        about: "",
        skills: [],
        experience: 0,
    });

    /* ================= FETCH PROFILE ================= */
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

                    profileImage: extractUrl(data.user.profileImage),

                    class10Certificate: extractUrl(data.user.class10Certificate),
                    class12Certificate: extractUrl(data.user.class12Certificate),
                    collegeCertificate: extractUrl(data.user.collegeCertificate),
                    phdOrOtherCertificate: extractUrl(data.user.phdOrOtherCertificate),

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

    /* ================= HANDLERS ================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleFileChange = (name, file) => {
        setFiles((prev) => ({ ...prev, [name]: file }));
    };

    const addSkill = () => {
        if (
            skillInput.trim() &&
            !formData.skills.includes(skillInput.trim()) &&
            formData.skills.length < 10
        ) {
            setFormData((p) => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "skills") {
                    body.append(key, JSON.stringify(formData.skills));
                } else {
                    body.append(key, formData[key] ?? "");
                }
            });

            Object.keys(files).forEach((key) => {
                body.append(key, files[key]);
            });

            const res = await fetch(`${BACKEND_URL}/api/teacher/update/me`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
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

    if (!currentUser) return <p>Loading...</p>;

    /* ================= VIEW MODE ================= */
    if (!isEditing) {
        return (
            <div style={{ maxWidth: 800, margin: "40px auto" }}>
                <h2>Teacher Profile</h2>

                {/* 🔥 PROFILE IMAGE */}
                <div style={{ marginBottom: 20 }}>
                    {formData.profileImage && !isPlaceholderHost(formData.profileImage) ? (
                        <img
                            src={formData.profileImage}
                            alt="Profile"
                            width="120"
                            style={{ borderRadius: "50%" }}
                        />
                    ) : (
                        <p>No profile image</p>
                    )}
                </div>

                <p><b>Name:</b> {formData.fullName}</p>
                <p><b>Email:</b> {formData.email}</p>
                <p><b>Phone:</b> {formData.phone}</p>
                <p><b>Address:</b> {formData.address}</p>
                <p><b>Experience:</b> {formData.experience} years</p>

                <p><b>About:</b> {formData.about || "—"}</p>

                <h3>Certificates</h3>
                <CertificateCard title="Class 10" src={formData.class10Certificate} />
                <CertificateCard title="Class 12" src={formData.class12Certificate} />
                <CertificateCard title="College" src={formData.collegeCertificate} />
                <CertificateCard title="PhD / Other" src={formData.phdOrOtherCertificate} />

                <br />
                <button onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
            </div>
        );
    }

    /* ================= EDIT MODE ================= */
    return (
        <div style={{ maxWidth: 800, margin: "40px auto" }}>
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit}>
                {/* 🔥 PROFILE IMAGE EDIT */}
                <label>Profile Image</label><br />
                {formData.profileImage && <img src={formData.profileImage} width="100" />}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("profileImage", e.target.files[0])}
                />

                <br /><br />

                <input name="fullName" value={formData.fullName} onChange={handleChange} />
                <textarea name="about" value={formData.about} onChange={handleChange} />

                <h3>Certificates</h3>
                <CertificateEdit name="class10Certificate" title="Class 10" src={formData.class10Certificate} onFileChange={handleFileChange} />
                <CertificateEdit name="class12Certificate" title="Class 12" src={formData.class12Certificate} onFileChange={handleFileChange} />
                <CertificateEdit name="collegeCertificate" title="College" src={formData.collegeCertificate} onFileChange={handleFileChange} />
                <CertificateEdit name="phdOrOtherCertificate" title="PhD / Other" src={formData.phdOrOtherCertificate} onFileChange={handleFileChange} />

                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
        </div>
    );
};

/* ================= UI COMPONENTS ================= */

const CertificateCard = ({ title, src }) => (
    <div>
        <b>{title}</b><br />
        {src && !isPlaceholderHost(src) ? <img src={src} width="150" /> : "—"}
    </div>
);

const CertificateEdit = ({ name, title, src, onFileChange }) => (
    <div>
        <label>{title}</label><br />
        {src && <img src={src} width="120" />}
        <input type="file" accept="image/*,application/pdf"
            onChange={(e) => onFileChange(name, e.target.files[0])}
        />
    </div>
);

export default Teacherprofile;
