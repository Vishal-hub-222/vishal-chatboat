import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext.jsx";
import "./Auth.css";

function EditProfile() {
    const { user, setUser, token } = useContext(MyContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: user?.name || "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password && form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        const body = {};
        if (form.name && form.name !== user?.name) body.name = form.name;
        if (form.password) body.password = form.password;

        if (Object.keys(body).length === 0) {
            return setError("No changes made");
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Update failed");
            } else {
                const updatedUser = { id: data.id, name: data.name, email: data.email };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccess("Profile updated successfully!");
                setForm(f => ({ ...f, password: "", confirmPassword: "" }));
            }
        } catch (err) {
            setError("Could not connect to server");
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <i className="fa-solid fa-arrow-left"></i> Back to Chat
                </button>

                <div className="auth-logo">
                    <span className="auth-logo-icon">👤</span>
                    <h1>Edit Profile</h1>
                </div>
                <p className="auth-subtitle">{user?.email}</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password <span className="optional">(leave blank to keep current)</span></label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat new password"
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
