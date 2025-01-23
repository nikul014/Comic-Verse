import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ComicCard from './ComicCard';

const Dashboard = () => {
    const { user, token } = useAuth(); // Access user and token from AuthContext
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isInitialCall = useRef(true); // Ref to track the initial API call

    // Function to fetch comics
    const fetchComics = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/comics?lastEvaluatedKey=`, {
                headers: { Authorization: `Bearer ${token}` } // Include token in headers if needed
            });
            setComics(response.data.data || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
            return;
        }

        if (isInitialCall.current) {
            fetchComics();
            isInitialCall.current = false; // Set to false after the first call
        }
    }, [user, token, navigate]);

    const handleLike = async (comicId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/like-comic`, { comicId });
            console.log('Liking comic:', response);
            // Fetch comics again to refresh the list after liking
            fetchComics();
        } catch (err) {
            console.error('Error liking comic:', err.message);
        }
    };

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
                                handleLike={() => handleLike(comic.id)} // Pass the comic ID to handleLike
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

export default Dashboard;
