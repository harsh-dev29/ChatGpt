import React, { useState } from "react";
import "../styles/theme.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axios.post('https://chatgpt-cwfx.onrender.com/api/auth/login', {
            email: formData.email,
            password: formData.password
        }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            navigate("/")
        }).catch((err) => {
            console.log(err);
        })
    };

    return (
        <>
            <ThemeToggle />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="auth-input"
                            // value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="auth-input"
                            // value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="submit" className="auth-button">
                            Login
                        </button>
                    </form>
                    <p className="auth-footer">
                        Don’t have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
