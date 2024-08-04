// Author: Rameez Parkar

import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const ComicCard = ({ comic, handleLike }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/comics/${comic.id}`, { state: { comic } });
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
                        className="btn btn-red"
                    >
                        Like
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
    }).isRequired,
    handleLike: PropTypes.func.isRequired,
};

export default ComicCard;
