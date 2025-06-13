import "../styles/FavoriteButton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const currentUser = {
    userID: 1,
    username: "user1",
    password: "Pass1",
    favListIsPrivate: true
};
const FavoriteButton = ({park}) => { //
    const handleSubmit = (parkCode) => {
        // event.preventDefault();

        // console.log('Park', park});
        console.log('Park', park.parkCode);
        
        fetch("/addFavorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID, parkCode: parkCode.toString()}),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert("Favorite added successfully!");
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Error adding favorite");
            });

    };

    return (
        <button
            className="favorites-button"
            id={`addFavorite-${park.parkCode}`}
                onClick={() => handleSubmit(park.parkCode)}>
            <FontAwesomeIcon icon={faPlus} />
        </button>
    );
};

export default FavoriteButton;
