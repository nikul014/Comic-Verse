import React, { useState } from 'react';
import axios from 'axios';


// Done

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        profilepicture: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/signup-user', formData);
            console.log(response.data);
            // Redirect to login page or show success message
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="mb-4 text-xl">Sign Up</h2>
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="text" name="profilepicture" placeholder="Profile Picture URL" value={formData.profilepicture} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
