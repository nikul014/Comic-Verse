import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import comicImage from "../assets/signup.jpg";

const maleAvatarUrls = [
    83, 87, 62, 97, 64, 85, 51, 68, 95, 81, 69, 72, 55, 74, 56, 58,
    96, 82, 53, 84, 91, 93, 76, 59, 88, 52, 94, 71, 75, 78, 90, 70,
    65, 61, 86, 60, 77, 63, 89, 67, 92, 57, 79, 98, 66, 54, 100, 73,
    80, 99
].map(id => `https://avatar.iran.liara.run/public/${id}`);

const femaleAvatarUrls = [
    26, 44, 6, 1, 14, 13, 33, 36, 17, 30, 28, 40, 10, 27, 49, 7, 38,
    12, 31, 42, 9, 46, 34, 45, 29, 48, 43, 47, 24, 4, 18, 41, 25, 19,
    3, 23, 21, 5, 11, 35, 16, 20, 50, 15, 39, 8, 22, 2, 32, 37
].map(id => `https://avatar.iran.liara.run/public/${id}`);

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        profilepicture: ''
    });
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(process.env.REACT_APP_BASE_URL+'/signup-user', formData);
            console.log(response.data);
            navigate('/login');
            toast.success('Sign up successful! Please log in.', {
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
            toast.error('Sign up failed. Please try again.', {
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

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAvatarSelect = (url) => {
        setFormData({ ...formData, profilepicture: url });
        setSelectedAvatar(url);
        closeDialog();
    };

    return (
        <div className="flex justify-center items-center bg-[#279EC5]">
            <div className="w-full h-screen overflow-hidden p-5 md:p-10">
                <div className="flex w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="w-full md:w-1/2 lg:mr-4 flex justify-center items-center">
                        <img
                            src={comicImage}
                            alt="Sign Up Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
                        <form className="p-6" onSubmit={handleSubmit}>
                            <div className="flex flex-wrap -mx-2 mb-4">
                                <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                                    <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Enter your first name"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-2">
                                    <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Enter your last name"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
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
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
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
                            <div className="mb-8 flex items-center">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture:</label>
                                <div className="ml-4">
                                    <div
                                        onClick={openDialog}
                                        className={`w-16 h-16 rounded-full border cursor-pointer flex items-center justify-center ${selectedAvatar ? '' : 'bg-gray-200'}`}
                                    >
                                        {selectedAvatar ? (
                                            <img src={selectedAvatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400">Choose</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center mt-4 mb-2">
                                <button
                                    type="submit"
                                    className={`w-full px-3 py-2 text-white bg-zinc-950 hover:bg-base-200 hover:text-black font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-base-200 focus:ring-opacity-50 ${loading ? 'bg-gray-400' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            <span>Loading...</span>
                                        </div>
                                    ) : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                        <h3 className="text-lg font-semibold mb-4">Select a Profile Picture</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[...maleAvatarUrls, ...femaleAvatarUrls].map((url, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleAvatarSelect(url)}
                                    className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                                >
                                    <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeDialog}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SignUp;
