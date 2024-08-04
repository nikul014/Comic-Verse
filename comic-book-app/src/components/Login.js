import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import comicImage from "../assets/login.jpg";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/login-user?email=${formData.email}&password=${formData.password}`);
            console.log(response.data);
            // Store token or user info in localStorage or context
            navigate('/');
            toast.success('Login successful!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error(error);
            toast.error('Login failed. Please check your credentials.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-[#3F7EDA]">
            <div className="w-full h-screen overflow-hidden p-5 md:p-20">
                <div className="flex w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="w-full md:w-1/2 hidden md:block">
                        <img
                            src={comicImage}
                            alt="Login Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
                        <form className="p-6" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email"
                                       className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password"
                                       className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-center mt-8 mb-2">
                                <button
                                    type="submit"
                                    className={`w-full px-3 py-2 text-white bg-zinc-950 hover:bg-base-200 hover:text-black font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-base-200 focus:ring-opacity-50 ${loading ? 'bg-gray-400' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Logging in...
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign
                                Up</a>
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot
                                    Password?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer/>
        </div>
    );
};

export default Login;
