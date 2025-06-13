import React, {useEffect, useState} from 'react';
import ParkSearchResults from "../components/ParkSearchResults";
import "../styles/SearchBar.css";
import "../styles/FavoriteButton.css"
import FavoriteButton from "../components/FavoriteButton";


function SearchBar() {
    const [defaultSearchTerm, setDefaultSearchTerm] = useState('');
    const [optionalFilter, setOptionalFilter] = useState('parks'); // Default optional filter
    const [parks, setParks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [start, setStart] = useState(0); // Pagination start
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false); // To track if a search has been made


    const API_KEY = "bRY9Rj1rEbQ4tpSvJZqS1Lt7rAd2YxglEOjZCpcg";
    const NPS_API_BASE_URL = `https://developer.nps.gov/api/v1/parks?api_key=${API_KEY}`;

    useEffect(() => {
        if (hasSearched) {
            handleSearch(true);
        }
    }, [start]);


    const handleSearch = async (appendResults = false) => {
        if (!defaultSearchTerm) {
            alert("Please enter a search term.");
            return;
        }

        setIsLoading(true);
        setError('');

        let url = `${NPS_API_BASE_URL}&limit=10&start=${start}`;

        if(optionalFilter === 'stateCode') {
            url += `&stateCode=${defaultSearchTerm}`;
        }
        else if(optionalFilter === "amenities" ){
            url.replace("parks", "amenities/parksplace?")
            url += `q=${defaultSearchTerm}`;
        }
        else if(optionalFilter === "activities" ){
            url.replace("parks", "activities/parks?")
            url += `q=${defaultSearchTerm}`;
        }
        else {
            url += `&q=${defaultSearchTerm}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.data) {
                setParks(appendResults ? [...parks, ...data.data] : data.data);
                setHasSearched(true); // Set has searched to true after successful data fetch
            } else {
                setError('No parks found. Try a different search.');
            }
        } catch (error) {
            // console.error("Failed to fetch parks:", error);
            setError('An error occurred while searching. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load more results
    const loadMoreResults = () => {
        setStart(start+10);
        handleSearch(true);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setStart(0);  // Reset start for a new search

            handleSearch(false);
        }
    };

    return (
        <div>
            {/* Inputs and Search button */}
            <div className="search-container">
                <input className="search-input"
                       id="search-input"
                       type="text"
                       data-testid="search-box"
                       value={defaultSearchTerm}
                       onChange={(e) => setDefaultSearchTerm(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Search by Park Name"
                />
                <select value={optionalFilter} onChange={(e) => setOptionalFilter(e.target.value)} data-testid="combobox">
                    <option value="activities">Activity</option>
                    <option value="amenities">Amenity</option>
                    <option value="parks">Park Name</option>
                    <option value="stateCode">State</option>
                </select>
                <button
                    className="search-bar-button"
                    id="search-bar-button"
                    onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
            {error && <p>{error}</p>}
            {/* Render ParkDetails for each park */}
            {parks.length > 0 ? (
                parks.map((park) => (
                    <div className="search-park-container" id={`search-${park.parkCode}`}>
                        <ParkSearchResults key={park.id} park={park}/>
                        <FavoriteButton park={park}/>
                    </div>
                ))
            ) : (
                isLoading && error && <p>No parks found. Try a different search.</p>
            )}
            {hasSearched && parks.length >= 10 && (
                <button className="load-more-results" onClick={loadMoreResults} disabled={isLoading} data-testid="load-more">
                    Load more results
                </button>
            )}
        </div>
    );
}

export default SearchBar;
