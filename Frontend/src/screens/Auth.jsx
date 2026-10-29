import { useState } from "react";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // login hai ya register, default login hai
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Input values update karne ke liye common handler
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // isLogin ke base par URL decide hoga
        const endpoint = isLogin
            ? "http://localhost:5000/api/login"
            : "http://localhost:5000/api/register";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            if (isLogin) {
                console.log("Login Success:", data);
                setMessage("Login successful!");
                // Agar token mil raha ho: localStorage.setItem("token", data.token);
            } else {
                console.log("Register Success:", data);
                setMessage("Registration successful! Please login.");
                setIsLogin(true); // Register hone ke baad user ko login view par switch kar sakte ho
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <button type="button" onClick={() => setIsLogin(true)}>
                    Login
                </button>
                <button type="button" onClick={() => setIsLogin(false)}>
                    Register
                </button>
            </div>

            <h1>{isLogin ? "Login" : "Register"}</h1>

            {/* Single dynamic form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Auth;
