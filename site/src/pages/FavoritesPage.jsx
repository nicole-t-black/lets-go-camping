import React, {useEffect, useState} from "react";
import "../styles/favorites.css";
import ParkSearchResults from "../components/ParkSearchResults";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons'


function FavoritesPage() {
    const [parks, setParks] = useState([]); //set to empty, retrieve from database
    const [searchedParks, setSearchedParks] = useState([]);
    const API_KEY = "AbsNMYjgoFTxspUU7emrVh0CurAHh4I8MrBMSHmC";
    const [privateToggle, setPrivateToggle] = useState(true); //retrieve from database
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [removedParkCode, setRemovedParkCode] = useState('');


    const currentUser = {
        userID: 1,
        username: "user1",
        password: "Pass1",
        favListIsPrivate: true
    };

    const fetchPublicVisibility = async () => {
        fetch(`/getVisibility?userID=${currentUser.userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Successfully fetched visibility.") {
                        console.log(response.favListIsPrivate);
                        setPrivateToggle(response.favListIsPrivate);
                    }
                    else {
                        console.log("Couldn't set favorite list visibility.");
                    }
                }
            )
    }

    const fetchFavorites = async () => {

        // set parks array
        fetch(`/getFavorites?userID=${currentUser.userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(response => {
                console.log(response.data);
                if(response.data === "Successfully fetched favorites.") {
                    console.log(response.favorites);
                    setParks(response.favorites);
                }
                else if(response.data === "No favorites. Add parks from the search page.") {
                    setParks(response.favorites);
                }
                else if (response?.data) {
                    console.log("Could not fetch favorites.");
                }
            })
    };

    useEffect(() => {
        if (parks.length >= 0) {
            const fetches = parks.map(park =>
                fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${park.parkCode}&api_key=${API_KEY}`)
                    .then(response => response.json())
            );

            Promise.all(fetches)
                .then(responses => Promise.all(responses.map(response => response.data)))
                .then(data => {
                    setSearchedParks(data.flat());
                })
        }
    }, [parks], [searchedParks]);

    useEffect(() => {
        fetchFavorites();
        fetchPublicVisibility();
    }, []);


    // Changes public/private setting in database
    const handleVisibilityToggle = () => {

        fetch("/toggleVisibility", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID}),
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Favorites visibility toggled.") {
                        setPrivateToggle(response.favListIsPrivate);
                    }
                    else {
                        if (response?.data) {
                            console.log("Could not change favorites list visibility.");
                        }
                    }
                }
            )
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        fetch("/clearFavorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID}),
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Clear favorites successful.") {
                        setSearchedParks([]);
                    }
                    else {
                        if (response?.data) {
                            console.log("Could not clear all favorites.");
                        }
                    }
                }
            )

    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const handleMoveUp = (parkCode) => {
        fetch("/moveParkUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID, parkCode: parkCode.toString()}),
        })
            .then((response) => response.json())
            .then(response => {
                console.log(response.data);
                if(response.data === "Move park up successful.") {
                    fetchFavorites();
                }
            })
    }

    const handleMoveDown = (parkCode) => {
        fetch("/moveParkDown", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID, parkCode: parkCode.toString()}),
        })
            .then((response) => response.json())
            .then(response => {
                console.log(response.data);
                if(response.data === "Move park down successful.") {
                    fetchFavorites();
                }
            })
    }

    const handleRemove = (parkCode) => {
        setShowRemoveConfirmation(true);
        setRemovedParkCode(parkCode);

    }

    const handleRemoveConfirm = () => {
        setShowRemoveConfirmation(false);
        fetch("/removeFavorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userID: currentUser.userID, parkCode: removedParkCode}),
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Remove favorite successful.") {
                        fetchFavorites();
                    }
                }
            )
        setRemovedParkCode('');

    };

    const handleRemoveCancel = () => {
        setShowRemoveConfirmation(false);
        setRemovedParkCode('');
    };

    return (
        <div>
            <div className="visibility-toggle">
                <button
                    id="togglePrivateButton"
                    data-testid="togglePrivateButton"
                    onClick={() => handleVisibilityToggle(!privateToggle)}>
                    {privateToggle ? 'Private' : 'Public'}
                </button>
            </div>
            <div className="favorites-page">
                {searchedParks.length > 0 ? (
                    searchedParks.map((park) => (
                        <div className="single-row">
                            <div className="buttons-fav">
                                <button
                                    id="moveUpButton"
                                    data-testid={`moveUpButton-${park.parkCode}`}
                                    onClick={() => handleMoveUp(park.parkCode)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            document.activeElement.click();
                                            // Code to trigger the popup
                                        }
                                    }}
                                ><FontAwesomeIcon icon={faArrowUp}/></button>
                                <button
                                    id="moveDownButton"
                                    data-testid={`moveDownButton-${park.parkCode}`}
                                    onClick={() => handleMoveDown(park.parkCode)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            document.activeElement.click();
                                            // Code to trigger the popup
                                        }
                                    }}
                                ><FontAwesomeIcon icon={faArrowDown}/></button>
                            </div>
                            <div className="park-container" key={park.id}>
                                <ParkSearchResults park={park}/>
                                <button
                                    className="minus-button"
                                    id="removeFavoriteButton"
                                    data-testid={`removeFavoriteButton-${park.parkCode}`} // Unique ID for each remove button
                                    onClick={() => handleRemove(park.parkCode)}
                                >
                                    <FontAwesomeIcon icon={faMinus} size="2x"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No parks in favorites. Add some parks.</p>
                )}
                {searchedParks.length > 0 && (
                    <div className="remove-buttons">
                        <button className="clear-button"
                                id="removeAllFavoritesButton"
                                onClick={() => setShowConfirmation(true)}
                                data-testid="removeAllFavoritesButton"
                        >Remove All Favorites
                        </button>
                    </div>
                )}

                {showConfirmation && (
                    <div className="confirmation-overlay">
                        <div className="confirmation-container">
                            <text className="confirmation-message">
                                Are you sure you want to remove all favorites?
                            </text>
                            <button
                                className="confirmation-button"
                                id="confirmRemoveAllButton"
                                data-testid="confirmRemoveAllButton"
                                onClick={handleConfirm}
                            >Confirm
                            </button>
                            <button
                                className="confirmation-button"
                                id="confirmNoRemoveAllButton"
                                data-testid="confirmNoRemoveAllButton"
                                onClick={handleCancel}>Cancel
                            </button>
                        </div>
                    </div>
                )}

                {showRemoveConfirmation && (
                    <div className="confirmation-overlay">
                        <div className="confirmation-container">
                            <text className="confirmation-message">
                                Are you sure you want to remove from favorites?
                            </text>
                            <button
                                className="confirmation-button"
                                id="confirmRemoveButton"
                                data-testid="confirmRemoveButton"
                                onClick={handleRemoveConfirm}
                            >Confirm
                            </button>
                            <button
                                className="confirmation-button"
                                id="confirmNoRemoveButton"
                                data-testid="confirmNoRemoveButton"
                                onClick={handleRemoveCancel}>Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default FavoritesPage;
