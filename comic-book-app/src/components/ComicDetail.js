import React from 'react';
import { useLocation } from 'react-router-dom';
// Done

const ComicDetail = () => {
    const location = useLocation();
    const { comic } = location.state || {};

    if (!comic) {
        return <div>No comic data available.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">{comic.name}</h1>
            <div className="p-4 border rounded shadow-md">
                <p><strong>Author:</strong> {comic.author}</p>
                <p><strong>Category:</strong> {comic.category}</p>
                <p><strong>Description:</strong> {comic.description}</p>
                <p><strong>Created At:</strong> {new Date(comic.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated At:</strong> {new Date(comic.updatedAt).toLocaleDateString()}</p>
                <p><strong>Comic Text:</strong> {comic.comicText}</p>
                <img src={comic.image} alt={comic.name} className="mt-2 w-full h-auto" />
                <p className="mt-4">{comic.comicText}</p>
                <a href={comic.pdfUrl} className="mt-4 text-blue-500 underline" target="_blank" rel="noopener noreferrer">View PDF</a>
            </div>
        </div>
    );
};

export default ComicDetail;
