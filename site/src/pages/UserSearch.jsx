import React, { useState, useEffect } from 'react';
import ParkSearchResults from "../components/ParkSearchResults";
import "../styles/UserSearch.css";
import "../styles/ParkSearchResults.css";

function UserSearch() {
    const [defaultSearchTerm, setDefaultSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [tempAllUsers, setTempAllUsers] = useState('');
    const [isComparing, setIsComparing] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [compared, setCompared] = useState(false);
    const [buttonMessage, setButtonMessage] = useState('');
    const [comparisons, setComparisons] = useState([]);
    const [parkUsers, setParkUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchedParks, setSearchedParks] = useState([]);
    const [displayUsernames, setDisplayUsernames] = useState('');
    const [selectedParkCode, setSelectedParkCode] = useState(null);
    const API_KEY = "AbsNMYjgoFTxspUU7emrVh0CurAHh4I8MrBMSHmC";

    //reset everything on reload and onload and add currUser to allUsers
    useEffect(() => {
        if(allUsers.length === 0) {
            setAllUsers(prevList => [...prevList, 1]);
        }

    }, [allUsers.length]);

    const pressEnterKey = e => {
        if (e.key === "Enter") {
            handleUserSearch();
        }
    }

    const handleUserSearch = async () => {

        if(!defaultSearchTerm) {
            setMessage('Please enter a username');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setButtonMessage('');

        fetch(`/user?username=${defaultSearchTerm}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((response) => {
                if (response?.data) {
                    //if it has a message check if successful
                    if(response.data.includes("Successfully")) {
                        //if message has successfully, then add user id to list of all users
                        setAllUsers(prevList => [...prevList, response.id]);
                    }

                    //set message to response message and reset text box
                    setMessage(response.data);
                    setDefaultSearchTerm('');
                }
        })

        .catch((error) => {
            setDefaultSearchTerm('');
            console.error('Error fetching data:', error);
            setMessage('An error occurred while fetching data.');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const clearList = async () => {
        setButtonMessage('');
        setMessage('');
        //clear the list of users being compared
        setAllUsers([]);
        //clear text box
        setDefaultSearchTerm('');
        setMessage("List Cleared");
    };

    const handleCompare = async () => {
        //send allUsers to backend as well as username of this user
        //do what we need to do back there
        setMessage('');
        setButtonMessage('');

        if(allUsers.length === 1) {
            setButtonMessage('Please add user(s).');
            return;
        }

        setIsComparing(true);
        setCompared(true);

        const queryParams = allUsers.map(userId => `allUserIds=${encodeURIComponent(userId)}`).join('&');

        fetch(`/comparisons?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.data) {
                    setButtonMessage(response.data);
                    //update our variables
                    setComparisons(response.results);
                    setParkUsers(response.parkUsers);

                    //need to store the size before we clear in finally block
                    setTempAllUsers(allUsers.length);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setButtonMessage('An error occurred while fetching data.');
            })
            .finally(() => {
                setIsComparing(false);
                setAllUsers([]);
                setDefaultSearchTerm('');
            });
    };

    const handleSuggest = async () => {
        //send allUsers to backend as well as username of this user
        //do what we need to do back there

        setMessage('');
        setButtonMessage('');

        if(allUsers.length === 1) {
            setButtonMessage('Please add user(s).');
            return;
        }

        setIsSuggesting(true);
        setCompared(false);

        const queryParams = allUsers.map(userId => `allUserIds=${encodeURIComponent(userId)}`).join('&');

        fetch(`/suggestions?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.data) {
                    setButtonMessage(response.data);
                    if(response.data.includes("match")) {
                        //update our variables
                        setSuggestions(response.suggest);
                    }
                    else {
                        setSuggestions([]);
                    }
                }

            })

            .catch((error) => {
                console.error('Error fetching data:', error);
                setButtonMessage('An error occurred while fetching data.');
            })
            .finally(() => {
                setIsSuggesting(false);
                setAllUsers([]);
                setDefaultSearchTerm('');
            });
    };

    //use Effect for loading comparisons
    useEffect(() => {
        const fetches = Object.keys(comparisons).map(parkCode => {
            return fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${API_KEY}`)
                .then(response => response.json())
        });

        Promise.all(fetches)
            .then(responses => Promise.all(responses.map(response => response.data)))
            .then(data => {
                setSearchedParks(data.flat());
            });
        setSelectedParkCode(null);
    }, [comparisons]);

    //use Effect for suggestions
    useEffect(() => {
        const fetches = suggestions.map(parkCode => {
            return fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${API_KEY}`)
                .then(response => response.json())
        });

        Promise.all(fetches)
            .then(responses => Promise.all(responses.map(response => response.data)))
            .then(data => {
                setSearchedParks(data.flat());
            });
    }, [suggestions]);

    const showUsers = (parkCode) => {
        setSelectedParkCode(parkCode);
        const listUsers = parkUsers[parkCode];
        const listString = listUsers.join(", ");
        setDisplayUsernames(listString);
    };

    const handleMouseLeave = () => {
        setSelectedParkCode(null);
    };


    return (
        <div className="compare-suggest-inline" >
            <div className="compare-suggest-add">
                <input type="text"
                       id="uname"
                       data-testid="uname"
                       alt="Type a username to search"
                       value={defaultSearchTerm}
                       onChange={(e) => setDefaultSearchTerm(e.target.value)}
                       placeholder="Search for a user"
                       onKeyDown={pressEnterKey}
                />
                <button id="add" data-testid="add" alt="add user" onClick={handleUserSearch} disabled={isLoading}>
                    {isLoading ? 'Adding User...' : 'Add User'}
                </button>
                <button id="clear" data-testid="clear" alt="clear list" onClick={clearList}>
                    Clear
                </button>
            </div>
            {/*display message"*/}
            {message && <p>{message}</p>}
            <div className="compare-suggest-buttons">
                <button id="compare" data-testid="compare" alt="compare users' lists" onClick={handleCompare} disabled={isComparing}>
                    {isComparing ? 'Comparing Parks...' : 'Compare'}
                </button>
                <button id="suggest" data-testid="suggest" alt="get a suggestion from lists" onClick={handleSuggest} disabled={isSuggesting}>
                    {isSuggesting ? 'Suggesting Parks...' : 'Suggest'}
                </button>
            </div>
            {buttonMessage && <p>{buttonMessage}</p>}
            <div>
                {searchedParks.map((park) => (
                    <div key={park.id} class="single-row2">
                        {compared && <div className="buttons-ratio">
                            <button
                                className="ratio-button"
                                alt="ratio of users with park in their list"
                                id={`showUsers-${park.parkCode}`}
                                data-testid={`showUsers-${park.parkCode}`} // Unique ID for each remove button
                                onMouseEnter={() => showUsers(park.parkCode)}
                                onMouseLeave={handleMouseLeave}
                                onFocus={() => showUsers(park.parkCode)}
                                onBlur={handleMouseLeave}
                            >{comparisons[park.parkCode]}/{tempAllUsers}</button>
                            <p data-testid={`users-${park.parkCode}`} className={selectedParkCode === park.parkCode ? 'visible' : 'hidden'}>
                                {displayUsernames}
                            </p>
                        </div>}
                        <div className="park-container">
                            {!compared
                                ? <ParkSearchResults park={park} suggest="suggesting"/>
                                : <ParkSearchResults park={park} suggest=""/>
                            }
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );
}

export default UserSearch;