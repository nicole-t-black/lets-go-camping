import React, {useState} from "react";

import "../styles/styles.css";
import logo from "../national.png";
import {Link, useNavigate} from "react-router-dom";

function SignUpPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSignUp = (event) => {
        event.preventDefault();
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password, passwordConfirmation}),
        })
            .then((response) => response.json())
            .then(response => {
                    console.log(response.data);
                    if(response.data === "Sign up successful.") {
                        navigate("/login");
                    }
                    else {
                        if (response?.data) {
                            setMessage(response.data);
                        }
                    }
                    setUsername('');
                    setPassword('');
                    setPasswordConfirmation('');
                }
            )
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        navigate("../");
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    return (
        <div className = "signup-page">
            <img className="logo" src={logo} width="250" height="350" alt="Nation Parks Service Logo"/>
            <div className = "signup-info">
                <h1 style={{ color: '#4B7211' }}>Sign Up Page</h1>
                <div className="signup-form">
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
                    <div className="single-input">
                        <text>Confirm Password</text>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            data-testid="confirmPassword"
                        />
                    </div>
                    <div className="buttons">
                        <button className="signup-button"
                                id="signUpButton"
                                onClick={handleSignUp}
                                data-testid="signUpButton"
                        >Sign Up
                        </button>
                        <button className="signup-button"
                                id="cancelButton"
                                onClick={() => setShowConfirmation(true)}
                                data-testid="cancelButton"
                        >Cancel
                        </button>
                    </div>
                </div>
                <div className="signup-form">
                    <text className="sign-up">Already have an account?
                        <Link to={"../"}>Login</Link>
                    </text>
                </div>
                <text className="error-message" id="message">{message}</text>
            </div>
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-container">
                        <text className="confirmation-message">
                            Are you sure you want to cancel?
                        </text>
                        <button
                            className="confirmation-button"
                            id="confirmCancelButton"
                            data-testid="confirmCancelButton"
                            onClick={handleConfirm}
                        >Confirm</button>
                        <button
                            className="confirmation-button"
                            id="confirmNoCancelButton"
                            data-testid="confirmNoCancelButton"
                            onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignUpPage;