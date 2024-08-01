import React, { useEffect, useState } from 'react';
import axios from 'axios';

// done
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Replace with actual dynamic value for email
    const email = "nikulpokukadiya1998@gmail.com";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/user-profile`, {
                    params: { email }
                });
                setProfile(response.data.data); // Adjust to access 'data' in the response
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [email]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Profile</h1>
            {profile ? (
                <div className="bg-white p-6 rounded shadow-md">
                    <div className="flex items-center mb-4">
                        <img
                            src={profile.profilepicture}
                            alt={`${profile.firstname} ${profile.lastname}`}
                            className="w-24 h-24 rounded-full object-cover mr-4"
                        />
                        <div>
                            <h2 className="text-xl mb-2">{profile.firstname} {profile.lastname}</h2>
                            <p className="text-gray-600">Email: {profile.email}</p>
                        </div>
                    </div>
                    {/* Add more profile details here */}
                </div>
            ) : (
                <div>No profile information available</div>
            )}
        </div>
    );
};

export default Profile;
