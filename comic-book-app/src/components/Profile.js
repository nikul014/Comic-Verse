import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'; // For loading spinner
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaEdit} from 'react-icons/fa'; // Import the edit icon from react-icons
import Switch from 'react-switch';
import comicImage from "../assets/profilebackground.jpg";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [subscriptions, setSubscriptions] = useState({
        "Sci-fi": false,
        "Fantasy": false,
        "Superhero": false,
        "Mystery": false
    });
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [actionLoading, setActionLoading] = useState(false); // Loader state for actions

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
            setActionLoading(true); // Start action loading
            try {
                const response = await axios.get(process.env.REACT_APP_BASE_URL+'/user-profile', {
                    params: {email}
                });

                // Parse the comma-separated category data
                const categories = response.data.data.category.split(',').filter(cat => cat); // Remove empty strings

                setProfile(response.data.data);

                // Update subscriptions state based on categories
                setSubscriptions(prevState => {
                    const updatedSubscriptions = {...prevState};
                    categories.forEach(category => {
                        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
                        if (updatedSubscriptions.hasOwnProperty(formattedCategory)) {
                            updatedSubscriptions[formattedCategory] = true;
                        }
                    });
                    return updatedSubscriptions;
                });

                setActionLoading(false);
            } catch (err) {
                setError(err.message);
                setActionLoading(false);
                toast.error('Failed to load profile.');
            }
        };

        fetchProfile();
    }, [email]);

    const handleSubscriptionChange = async (category, isSubscribed) => {
        setActionLoading(true); // Start action loading
        const action = isSubscribed ? "add" : "remove";
        try {
            await axios.post(process.env.REACT_APP_BASE_URL+'/subscribe', {
                email,
                category,
                action
            });
            setSubscriptions(prevState => ({
                ...prevState,
                [category]: isSubscribed
            }));
            toast.success(`${category} subscription ${isSubscribed ? 'added' : 'removed'}`);
        } catch (err) {
            console.error('Subscription update failed', err.message);
            toast.error('Subscription update failed.');
        } finally {
            setActionLoading(false); // Stop action loading
        }
    };

    const handleSwitchChange = (category) => {
        const isSubscribed = !subscriptions[category];
        handleSubscriptionChange(category, isSubscribed);
    };

    const updateProfilePicture = async (firstname, lastname, newProfilePicture) => {
        setActionLoading(true); // Start action loading
        try {
            await axios.post(process.env.REACT_APP_BASE_URL+'/editProfile', {
                email,
                firstname,
                lastname,
                profilepicture: newProfilePicture
            });
            setProfile(prevProfile => ({
                ...prevProfile,
                firstname,
                lastname,
                profilepicture: newProfilePicture
            }));
            setShowAvatarPicker(false);
            toast.success('Profile picture updated successfully.');
        } catch (err) {
            console.error('Profile picture update failed', err.message);
            toast.error('Profile picture update failed.');
        } finally {
            setActionLoading(false); // Stop action loading
        }
    };

    const handleEditProfile = async () => {
        setActionLoading(true); // Start action loading
        try {
            await axios.post(process.env.REACT_APP_BASE_URL+'/editProfile', {
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
            toast.success('Profile updated successfully.');
        } catch (err) {
            console.error('Profile update failed', err.message);
            toast.error('Profile update failed.');
        } finally {
            setActionLoading(false); // Stop action loading
        }
    };

    if (actionLoading) return (
        <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#980000"} loading={actionLoading}/>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-red-600 text-xl">{error}</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${comicImage})`}}>

            <div className="max-w-3xl min-h-screen mx-auto py-4 px-2">

                {profile ? (
                    <div className="bg-white min-h-screen p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            {/* Profile Image Section */}
                            <div className="relative mr-6">
                                <img
                                    src={profile["profilepicture"]}
                                    alt={`${profile["firstname"]} ${profile["lastname"]}`}
                                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                                />
                                <FaEdit
                                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                    className="absolute top-2 right-2 text-white bg-[#980000] p-1 rounded-full cursor-pointer shadow-sm transition-colors duration-200 hover:bg-red-800"
                                    size={32}
                                />
                            </div>

                            {/* User Details Section */}
                            <div className="flex flex-col">
                                <div
                                    className="text-xl font-semibold">{profile["firstname"]} {profile["lastname"]}</div>
                                <div className="text-gray-600">{profile["email"]}</div>
                            </div>

                        </div>

                        {showAvatarPicker && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {(profile.gender === 'male' ? maleAvatarUrls : femaleAvatarUrls).map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Avatar ${index}`}
                                        className="w-24 h-24 rounded-full object-cover cursor-pointer shadow-sm border-2 border-transparent transition-all duration-200 hover:border-[#980000]"
                                        onClick={() => updateProfilePicture(profile.firstname, profile.lastname, url)}
                                    />
                                ))}
                            </div>
                        )}
                        {isEditing ? (
                            <div className="flex justify-center items-center">
                                <div
                                    className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-100 rounded-lg shadow-3xl">
                                    <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleEditProfile();
                                    }}>
                                        <div className="mb-4">
                                            <label htmlFor="firstName"
                                                   className="block text-gray-700 text-sm font-bold mb-2">First
                                                Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={newFirstName}
                                                onChange={(e) => setNewFirstName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#980000] focus:border-[#980000] sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="lastName"
                                                   className="block text-gray-700 text-sm font-bold mb-2">Last
                                                Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={newLastName}
                                                onChange={(e) => setNewLastName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#980000] focus:border-[#980000] sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <button
                                                type="submit"
                                                className="bg-[#980000] text-white py-2 px-4 rounded-full shadow-md hover:bg-red-800 transition-colors duration-200"
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Updating..." : "Update Profile"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="text-[#980000] py-2 px-4 rounded-full border border-[#980000] shadow-md hover:bg-[#980000] hover:text-white transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#980000] text-white py-2 px-4 rounded-full shadow-md hover:bg-red-800 transition-colors duration-200"
                            >
                                Edit Profile
                            </button>
                        )}

                        <div className="mt-24">
                            <h4 className="text-xl mt-4 mb-1">Notifications</h4>
                            <h6 className="text-sm mb-4">Enable the below checkbox to get notified for every new comic
                                book
                                added to ComicVerse.</h6>
                            {Object.entries(subscriptions).map(([category, isSubscribed]) => (
                                <div key={category} className="flex items-center mb-4 ml-6">
                                    <span className="mr-2 text-sm capitalize">{category}</span>
                                    <Switch
                                        checked={isSubscribed}
                                        onChange={() => handleSwitchChange(category)}
                                        onColor="#980000"
                                        offColor="#d1d5db"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        className="react-switch"
                                    />
                                    {actionLoading && <ClipLoader size={20} color={"#3b82f6"} loading={actionLoading}/>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-xl">No profile data available</p>
                )}


            </div>
        </div>);
};

export default Profile;
