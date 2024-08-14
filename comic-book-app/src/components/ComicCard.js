// Author: Rameez Parkar

import PropTypes from 'prop-types';
import {Link, useNavigate} from 'react-router-dom';

const ComicCard = ({comic, handleLike}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/comics/${comic.id}`, {state: {comic}});
    };
    // Define the placeholder image URL
    const placeholderImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuIfyNjV-O42kmF5leiXuY07IzyoeTbgwt8A&s';

    // Function to handle image loading errors
    const handleImageError = (e) => {
        e.target.src = placeholderImage; // Set placeholder image on error
    };


    return (
        <div
            className="card bg-white shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105 cursor-pointer m-4"
            onClick={handleCardClick}
        >
            <figure>
                <img
                    src={comic.image || placeholderImage}
                    alt={comic.name}
                    className="w-full h-64 object-cover rounded-t-lg transition-transform transform hover:scale-110"
                    onError={handleImageError} // Handle image load error
                />
            </figure>
            <div className="card-body p-4">
                <h3 className="text-xl font-semibold mb-2">{comic.name}</h3>
                <p className="text-gray-600 mb-2">{comic.description}</p>
                <Link to={`/comics/${comic.id}`} state={{comic}} className="text-blue-600 hover:underline">
                    View Details
                </Link>
                <div className="card-actions justify-end mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card's click event
                            handleLike(comic.id);
                        }}
                        className="relative flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                        </svg>

                        <span className="font-medium">Like</span>
                        <span

                            className="absolute top-1 right-1 bg-white border border-red-500 text-red-500 rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{transform: 'translate(50%, -50%)'}}
                        >
    {comic.likes || 0}
        </span>
                    </button>
                </div>

            </div>
        </div>
    );
};

ComicCard.propTypes = {
    comic: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        coverImage: PropTypes.string,
        description: PropTypes.string.isRequired,
        likes: PropTypes.string
    }).isRequired,
    handleLike: PropTypes.func.isRequired,
};

export default ComicCard;
