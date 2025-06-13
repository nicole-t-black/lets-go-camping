import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

import "../styles/styles.css";
import logo from "../national.png";

function LoginPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [timer, setTimer] = useState(30);
    const [timerInterval, setTimerInterval] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Account blocked.") {
                        setPopupMessage(response.data);
                        setTimer(30);
                        setTimerInterval(setInterval(() => {
                            setTimer(prevTimer => {
                                if (prevTimer > 0) {
                                    return prevTimer - 1;
                                } else {
                                    return 0;
                                }
                            });
                        }, 1000));
                    }
                    else if(response.data === "Login successful.") {
                        navigate("/search");
                    }
                    else if (response?.data) {
                        setMessage(response.data);
                    }
                    setUsername('');
                    setPassword('');
                }
            )
    }

    const handlePopupClose = () => {
        setPopupMessage("");
        clearInterval(timerInterval);
        setTimer(30);
    }

    return (
        <div className = "login-page">
            <img className="logo" src={logo} width="250" height="350" alt="Nation Parks Service Logo"/>
            <div className="login-info">
                <h1 style={{color: '#4B7211'}}>Login Page</h1>
                <div className="login-form">
                    <div className="single-input">
                        <text>Username</text>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            data-testid="username"
                        />
                    </div>
                    <div className="single-input">
                        <text>Password</text>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-testid="password"
                        />
                    </div>
                    <button
                        className="login-button"
                        id="loginButton"
                        data-testid="loginButton"
                        onClick={handleSubmit}
                    >Login</button>
                </div>
                <div className="login-form">
                    <text className="sign-up">Don't have an account?
                        <Link to={"./signup"} id="signUpRedirect">Sign Up</Link>
                    </text>
                </div>
                <text
                    className="error-message"
                    id="message"
                    data-testid="error-message">{message}</text>
            </div>
            {popupMessage && (
                <div className="confirmation-overlay">
                    <div className="confirmation-container" data-testid="confirmation-container">
                        <text className="confirmation-message" data-testid="confirmation-message">
                            {popupMessage}
                        </text>
                        <text className="popup-timer" data-testid="popup-timer">Try again in {timer} seconds</text>
                        {timer <= 0 && (
                            <button
                                className="confirmation-button"
                                data-testid="popup-close-button"
                                id="popupCloseButton"
                                onClick={handlePopupClose}
                            >Close</button>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default LoginPage;