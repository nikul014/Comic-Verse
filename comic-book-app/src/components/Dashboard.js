import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComicCard from './ComicCard';

const Dashboard = () => {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_BASE_URL+'/comics?lastEvaluatedKey=');
                setComics(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComics();
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="font-poppins antialiased text-gray-900 bg-white">

            <main className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comics.length > 0 ? (
                        comics.map((comic) => (
                            <ComicCard
                                key={comic.id}
                                comic={comic}
                                handleLike={handleLike}
                            />
                        ))
                    ) : (
                        <div className="text-center col-span-full text-xl text-gray-500">
                            No comics available
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const handleLike = async (comicId) => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL+'/like-comic', { comicId });
        console.log('Liking comic:', response);
        // Optionally, refresh the list or update the like count in the UI
    } catch (err) {
        console.error('Error liking comic:', err.message);
    }
};

export default Dashboard;
