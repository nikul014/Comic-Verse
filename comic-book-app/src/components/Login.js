import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Done

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/login-user?email=${formData.email}&password=${formData.password}`);
            console.log(response.data);
            // Store token or user info in localStorage or context
            navigate('/dashboard')
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="mb-4 text-xl">Login</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
