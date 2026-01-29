import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const Teacherprofile = () => {

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");

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

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                setCurrentUser(data.user);
            } catch (error) {
                // Token expired / invalid
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
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

    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const addSkill = () => {
        if (
            skillInput.trim() &&
            formData.skills.length < 10 &&
            !formData.skills.includes(skillInput.trim())
        ) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()],
            });
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/teacher/update/ME`, {
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
    return (
        <div style={{ maxWidth: 700, margin: "40px auto" }}>
            <h2>Teacher Profile</h2>

            <form onSubmit={handleSubmit}>
                <input name="fullName" placeholder="Full Name" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <input name="phone" placeholder="Phone" onChange={handleChange} />
                <input name="address" placeholder="Address" onChange={handleChange} />

                <select name="gender" onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <input name="class10Certificate" placeholder="Class 10 Certificate URL" onChange={handleChange} />
                <input name="class12Certificate" placeholder="Class 12 Certificate URL" onChange={handleChange} />
                <input name="collegeCertificate" placeholder="College Certificate URL" onChange={handleChange} />
                <input name="phdOrOtherCertificate" placeholder="PhD / Other Certificate URL" onChange={handleChange} />

                <input name="profileImage" placeholder="Profile Image URL" onChange={handleChange} />

                <textarea
                    name="about"
                    placeholder="About (max 500 characters)"
                    maxLength={500}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="experience"
                    placeholder="Experience (years)"
                    min={0}
                    onChange={handleChange}
                />

                {/* ================= SKILLS ================= */}
                <div>
                    <input
                        placeholder="Type skill and press Add"
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
                                style={{
                                    padding: "5px 10px",
                                    margin: 5,
                                    display: "inline-block",
                                    background: "#e5e7eb",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                }}
                                onClick={() => removeSkill(skill)}
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
