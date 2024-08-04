import React from 'react';
import { useLocation } from 'react-router-dom';

const ComicDetail = () => {
    const location = useLocation();
    const { comic } = location.state || {};

    // Define the placeholder image URL
    const placeholderImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuIfyNjV-O42kmF5leiXuY07IzyoeTbgwt8A&s';

    // Function to handle image loading errors
    const handleImageError = (e) => {
        e.target.src = placeholderImage; // Set placeholder image on error
    };

    if (!comic) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
                No comic data available.
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">{comic.name}</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="relative">
                        <img
                            src={comic.image || placeholderImage}
                            alt={comic.name}
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                            onError={handleImageError} // Handle image load error
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 rounded-lg"></div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-xl font-semibold text-gray-800"><strong>Author:</strong> {comic.author}</p>
                        <p className="text-xl font-semibold text-gray-800"><strong>Category:</strong> {comic.category}</p>
                        <p className="text-lg text-gray-600"><strong>Description:</strong> {comic.description}</p>
                        <p className="text-lg text-gray-600"><strong>Created At:</strong> {new Date(comic.createdAt).toLocaleDateString()}</p>
                        <p className="text-lg text-gray-600"><strong>Updated At:</strong> {new Date(comic.updatedAt).toLocaleDateString()}</p>
                        <a href={comic.pdfUrl}
                           className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                           target="_blank" rel="noopener noreferrer">View PDF</a>
                    </div>
                </div>
                <div className="mt-8 text-lg leading-relaxed text-gray-800">
                    <p>{comic.comicText}</p>
                </div>
            </div>
        </div>
    );
};

export default ComicDetail;
