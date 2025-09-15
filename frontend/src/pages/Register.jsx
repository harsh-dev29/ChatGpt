import React, { useState } from "react";
import "../styles/theme.css";
import ThemeToggle from "../components/ThemeToggle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);


        axios.post("https://chatgpt-cwfx.onrender.com/api/auth/register", {
            email: formData.email,
            fullName: {
                firstName: formData.firstName,
                lastName: formData.lastName
            },
            password: formData.password,
        }).then((res) => {
            console.log(res);
            navigate("/")
        }).catch((err) => {
            console.log(err);
            alert("Registration failed (placeholder)")

        })

    };

    return (
        <>
            <ThemeToggle />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="auth-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="auth-input"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="auth-input"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="auth-input"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="submit" className="auth-button">
                            Register
                        </button>
                    </form>
                    <p className="auth-footer">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
