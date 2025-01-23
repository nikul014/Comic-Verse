import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import comicImage from "../assets/login.jpg";
import emailjs from 'emailjs-com';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };
// Function to generate a random 8-digit password
    const generateRandomPassword = () => {
        const length = 8;
        let password = '';
        for (let i = 0; i < length; i++) {
            password += Math.floor(Math.random() * 10); // Generate a random digit
        }
        return password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newPassword = generateRandomPassword(); // Generate the password
            const response = await axios.post(process.env.REACT_APP_BASE_URL + '/forgot-password', {
                email,
                newPassword
            });

            await emailjs.send("service_rz6pqrk", "template_k0yud4c", {
                message: newPassword,
                user_email: email,
                reply_to: "comicverse.support@gmail.com",
            }, "T2dxCzyTM6YA5xkKj");

            console.log(response.data);
            toast.success('Password reset instructions have been sent to your email.', {
                position: "top-right",
            });
            navigate('/login');

        } catch (error) {
            console.error(error);
            toast.error('Failed to send password reset instructions. Please try again.', {
                position: "top-right",
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
                            alt="Forgot Password Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
                        <form className="p-6" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email"
                                       className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={email}
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
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Instructions'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;
