import React, { useState } from 'react';
import axios from 'axios';
// DOne
const CreateComic = () => {
    const [formData, setFormData] = useState({
        id: '',
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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
        setError(null);
        setSuccess(null);

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

            setSuccess('Comic created successfully!');
            console.log(response.data);
            // Redirect to dashboard or show success message
        } catch (error) {
            setError('Error creating comic.');
            console.error(error);
            // Handle error
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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="mb-4 text-xl">Create Comic</h2>
                <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />

                <select name="category" value={formData.category} onChange={handleChange} className="mb-2 p-2 border rounded w-full">
                    <option value="Superhero">Superhero</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Mystery">Mystery</option>
                </select>

                <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="mb-2 p-2 border rounded w-full" />

                <div className="mb-4">
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="submissionType"
                            value="comicText"
                            checked={submissionType === 'comicText'}
                            onChange={handleSubmissionTypeChange}
                        />
                        Comic Text
                    </label>
                    <label className="ml-2">
                        <input
                            type="radio"
                            name="submissionType"
                            value="pdfFile"
                            checked={submissionType === 'pdfFile'}
                            onChange={handleSubmissionTypeChange}
                        />
                        PDF File
                    </label>
                </div>

                {submissionType === 'comicText' && (
                    <textarea name="comicText" placeholder="Comic Text" value={formData.comicText} onChange={handleChange} className="mb-2 p-2 border rounded w-full"></textarea>
                )}

                {submissionType === 'pdfFile' && (
                    <input type="file" name="pdfFile" onChange={handleChange} className="mb-2 p-2 border rounded w-full" />
                )}

                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default CreateComic;
