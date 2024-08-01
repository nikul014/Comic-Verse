import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Done

const Dashboard = () => {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await axios.get('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/comics?lastEvaluatedKey=');
                setComics(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComics();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Dashboard</h1>
            <div className="mb-4">
                <Link to="/create-comic" className="bg-blue-500 text-white p-2 rounded mr-2 inline-block">Create Comic</Link>
                <Link to="/profile" className="bg-green-500 text-white p-2 rounded inline-block">Profile</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comics.length > 0 ? (
                    comics.map((comic) => (
                        <div key={comic.id} className="border p-4 rounded">
                            <h2 className="text-xl mb-2">{comic.name}</h2>
                            <p>{comic.description}</p>
                            <Link to={`/comics/${comic.id}`} state={{ comic }} className="text-blue-500">View Details</Link>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleLike(comic.id)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    Like
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No comics available</div>
                )}
            </div>
        </div>
    );
};

const handleLike = async (comicId) => {
    try {
        const response = await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/like-comic', { comicId });
        console.log('Liking comic:', response);
        // Optionally, refresh the list or update the like count in the UI
    } catch (err) {
        console.error('Error liking comic:', err.message);
    }
};

export default Dashboard;
