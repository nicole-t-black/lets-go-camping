import React from "react";
import UserSearch from './UserSearch.jsx';
import "../styles/CompareSuggest.css";

function CompareSuggestPage() {

    return (
        <div className="compare-suggest">
            <h1 style={{color: '#4B7211'}}>Compare and Suggest Parks with Friends</h1>
            <UserSearch></UserSearch>
        </div>


);
}

export default CompareSuggestPage;