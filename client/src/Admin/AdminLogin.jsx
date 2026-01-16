import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const AdminLogin = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password.trim(),
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Login failed")
            }

            localStorage.setItem("adminToken", data.token)
            navigate("/admin-enrollment")
        } catch (err) {
            console.error("LOGIN ERROR:", err.message)
            alert(err.message)
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Admin Login
                </h2>

                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="admin@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
