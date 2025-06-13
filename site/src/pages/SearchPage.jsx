import SearchBar from './SearchBar.jsx'
import React from "react";
import "../styles/SearchPage.css";
// Have the Header with the Camp Ground Application Information.
function SearchPage() {
    return (
        <div className="search-page">
            <h1 style={{color: '#4B7211'}}>Search For National Parks Here</h1>
            <SearchBar></SearchBar>
        </div>
    );
}

export default SearchPage;
