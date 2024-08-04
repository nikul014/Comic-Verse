import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import comicImage from '../assets/comic-creation.png'; // Optional decorative image

const CreateComic = () => {
    const [formData, setFormData] = useState({
        id: '', // This will be set dynamically
        name: '',
        author: '',
        category: 'Superhero', // Default category
        comicText: '',
        image: '',
        description: '',
        pdfFile: null
    });
    const [submissionType, setSubmissionType] = useState('comicText');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Generate a new UUID for the comic ID when the component mounts
        setFormData(prevData => ({ ...prevData, id: uuidv4() }));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmissionTypeChange = (e) => {
        setSubmissionType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { id, name, author, category, comicText, image, description, pdfFile } = formData;

        try {
            let payload = { id, name, author, category, image, description };

            if (submissionType === 'pdfFile' && pdfFile) {
                const pdfBase64 = await toBase64(pdfFile);
                payload.pdfFile = pdfBase64;
            } else if (submissionType === 'comicText' && comicText) {
                payload.comicText = comicText;
            }

            const response = await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/create-comic', payload);

            toast.success('Comic created successfully!');
            console.log(response.data);
        } catch (error) {
            toast.error('Error creating comic.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the base64 prefix
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${comicImage})` }}>
            <div className="flex justify-center items-center min-h-screen py-4 px-2">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Comic Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    >
                                        <option value="Superhero">Superhero</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Sci-Fi">Sci-Fi</option>
                                        <option value="Mystery">Mystery</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submission Type Section */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-4">Submission Type</h2>
                            <div className="flex items-center space-x-6 mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="submissionType"
                                        value="comicText"
                                        checked={submissionType === 'comicText'}
                                        onChange={handleSubmissionTypeChange}
                                        className="form-radio text-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">Comic Text</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="submissionType"
                                        value="pdfFile"
                                        checked={submissionType === 'pdfFile'}
                                        onChange={handleSubmissionTypeChange}
                                        className="form-radio text-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">PDF File</span>
                                </label>
                            </div>

                            {submissionType === 'comicText' && (
                                <div className="mb-4">
                                    <label htmlFor="comicText" className="block text-gray-700 text-sm font-bold mb-2">Comic Text:</label>
                                    <textarea
                                        name="comicText"
                                        value={formData.comicText}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100 h-32"
                                    />
                                </div>
                            )}

                            {submissionType === 'pdfFile' && (
                                <div className="mb-4">
                                    <label htmlFor="pdfFile" className="block text-gray-700 text-sm font-bold mb-2">PDF File:</label>
                                    <input
                                        type="file"
                                        name="pdfFile"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-base-100"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-center mt-4 mb-2">
                            <button
                                type="submit"
                                className="w-full px-3 py-2 text-white bg-zinc-950 hover:bg-base-200 hover:text-black font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-base-200 focus:ring-opacity-50"
                                disabled={loading}
                            >
                                {loading ? <PulseLoader color="#ffffff" size={10} /> : 'Create Comic'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default CreateComic;
