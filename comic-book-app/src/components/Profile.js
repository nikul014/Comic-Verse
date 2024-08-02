import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptions, setSubscriptions] = useState({
        "Sci-Fi": false,
        "Fantasy": false,
        "Superhero": false,
        "Mystery": false
    });
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');

    const email = "nikulpokukadiya1998@gmail.com";

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/user-profile', {
                    params: { email }
                });
                setProfile(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [email]);

    const handleSubscriptionChange = async (category, isSubscribed) => {
        const action = isSubscribed ? "add" : "remove";
        try {
            await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/subscribe', {
                email,
                category,
                action
            });
            setSubscriptions(prevState => ({
                ...prevState,
                [category]: isSubscribed
            }));
        } catch (err) {
            console.error('Subscription update failed', err.message);
        }
    };

    const handleCheckboxChange = (category) => {
        const isSubscribed = !subscriptions[category];
        handleSubscriptionChange(category, isSubscribed);
    };

    const updateProfilePicture = async (firstname, lastname, newProfilePicture) => {
        try {
            await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/editProfile', {
                email,
                firstname,
                lastname,
                profilepicture: newProfilePicture
            });
            setProfile(prevProfile => ({
                ...prevProfile,
                firstname: firstname,
                lastname: lastname,
                profilepicture: newProfilePicture
            }));
            setShowAvatarPicker(false);
        } catch (err) {
            console.error('Profile picture update failed', err.message);
        }
    };

    const handleEditProfile = async () => {
        try {
            await axios.post('https://i1attpz71h.execute-api.us-east-1.amazonaws.com/term3/editProfile', {
                email,
                firstname: newFirstName,
                lastname: newLastName,
                profilepicture: profile.profilepicture
            });
            setProfile(prevProfile => ({
                ...prevProfile,
                firstname: newFirstName,
                lastname: newLastName
            }));
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update failed', err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Profile</h1>
            {profile ? (
                <div className="bg-white p-6 rounded shadow-md">
                    <div className="flex items-center mb-4 relative">
                        <img
                            src={profile["profilepicture"]}
                            alt={`${profile["firstname"]} ${profile["lastname"]}`}
                            className="w-24 h-24 rounded-full object-cover mr-4"
                        />
                        <button
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                        >
                            Edit
                        </button>
                    </div>

                    {showAvatarPicker && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {(profile.gender === 'male' ? maleAvatarUrls : femaleAvatarUrls).map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Avatar ${index}`}
                                    className="w-16 h-16 rounded-full object-cover cursor-pointer"
                                    onClick={() => updateProfilePicture(profile.firstname, profile.lastname, url)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <h3 className="text-lg mb-2">Manage Subscriptions</h3>
                        {['Sci-Fi', 'Fantasy', 'Superhero', 'Mystery'].map(category => (
                            <div key={category} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={category}
                                    checked={subscriptions[category]}
                                    onChange={() => handleCheckboxChange(category)}
                                    className="mr-2"
                                />
                                <label htmlFor={category} className="text-gray-700">{category}</label>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        {!isEditing ? (
                            <div>
                                <p className="text-lg mb-2">Name: {profile.firstname} {profile.lastname}</p>
                                <button
                                    onClick={() => {
                                        setNewFirstName(profile.firstname);
                                        setNewLastName(profile.lastname);
                                        setIsEditing(true);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full"
                                >
                                    Edit Name
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-2">Edit Name</h3>
                                <input
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    className="border rounded p-2 mb-2 w-full"
                                    placeholder="First Name"
                                />
                                <input
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    className="border rounded p-2 mb-2 w-full"
                                    placeholder="Last Name"
                                />
                                <button
                                    onClick={handleEditProfile}
                                    className="bg-green-500 text-white px-4 py-2 rounded-full"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full ml-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>No profile information available</div>
            )}
        </div>
    );
};

export default Profile;
