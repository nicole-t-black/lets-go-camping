import {NavLink, useLocation} from "react-router-dom";
import "../styles/nav.css";
import React, {useState} from "react";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Navbar = () => {

    const location = useLocation();
    const { pathname } = location;
    const [showMenu, setShowMenu] = useState(false);

    const showNavElements = () => {
        return !(pathname === "/signup" || pathname === "/");
    };

    return (
        <nav className="navbar">
            <div className="container">
                <h2 className="logo">Let's Go Camping!</h2>
                {showNavElements()  && (<h4 className="logo"> Group 11</h4>)}
                {showNavElements() && (
                    <div className="mobile-menu">
                        <button
                            className="menu-button"
                            data-testid="menu-button"
                            onClick={() => setShowMenu(!showMenu)}>
                            {showMenu ? 'X' : <FontAwesomeIcon icon={faBars}/>}
                        </button>
                        <div className={`nav-elements ${showMenu ? 'show-menu' : ''}`}>
                            <ul>
                                <li>
                                    <NavLink
                                        id="search"
                                        data-testid="search"
                                        to="/search"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >Search</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        id="favorites"
                                        data-testid="favorites"
                                        to="/favorites"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >Favorites</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        id="compare-suggest"
                                        data-testid="compare-suggest"
                                        to="/compare-suggest"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >Let's Compare</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        id="signOut"
                                        data-testid="signOut"
                                        to="/"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >Sign Out</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;