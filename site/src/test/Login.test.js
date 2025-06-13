import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(() => {
    fetch.resetMocks();
});

test("navigate to and from login page", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

    // verify page content for default route
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(document.getElementById("username")).toBeInTheDocument();
    expect(document.getElementById("password")).toBeInTheDocument();


    // verify page content for expected route after navigating
    await waitFor(() => user.click(screen.getByText(/Sign Up/)));
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();
    expect(screen.getByText(/Confirm Password/)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByText(/Login/)));
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
});

// Test the input handling and rendering for username and password
test("initially render the login page with input values", async () => {
    const user = userEvent.setup();
    render(<App/>, {wrapper: BrowserRouter});

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();

    await user.type(screen.getByTestId("username"), "testUser");
    await user.type(screen.getByTestId("password"), "p@ssw0rd");

    expect(screen.getByTestId("username")).toHaveValue("testUser");
    expect(screen.getByTestId("password")).toHaveAttribute('value', 'p@ssw0rd');
});

// Test the login functionality with correct credentials and redirection to search page
test("use correct credentials to test login functionality", async () => {

    fetch.mockResponseOnce(JSON.stringify({ data: "Login successful." }));

    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

    // verify page content for default route
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    await waitFor(() => user.type(screen.getByTestId("username"), "testUser"));
    await waitFor(() => user.type(screen.getByTestId("password"), "validPassword1"));

    await waitFor(() => user.click(screen.getByTestId("loginButton")));
    expect(screen.getByText(/Search For National Parks Here/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
});

// Display messaging due to incorrect credentials
test("submit the login form with incorrect credentials", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "User not registered." }));

    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    await waitFor(() => user.type(screen.getByTestId("username"), "testUser"));
    await waitFor(() => user.type(screen.getByTestId("password"), "invalidPassword1"));

    await waitFor(() => user.click(screen.getByTestId("loginButton")));
    expect(screen.queryByText("User not registered.")).toBeInTheDocument();
});


// Test the `Login` button behavior when the user tries to submit empty input fields
test("Login button availability for empty input fields", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({data: "Login unsuccessful, username and password required."}));

    const user = userEvent.setup();
    render(<App/>, {wrapper: BrowserRouter});

    await waitFor(() => user.click(screen.getByTestId("loginButton")));

    expect(screen.getByText("Login unsuccessful, username and password required.")).toBeInTheDocument();
});

// Test the pop-up behavior when the user tries to unsuccessfully logs in 3 times in a row
test("Unsuccessful login 3 times in a row", async () => {
    const user= userEvent.setup();
    render(<App/>, {wrapper: BrowserRouter});

    // set up mock calls
    fetchMock.mockResponseOnce(JSON.stringify({ data: "Login unsuccessful, username and password required." }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "Login unsuccessful, username and password required." }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: "Account blocked." }));

    // verify page content for default route
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();

    jest.setTimeout(60000);

    for (let i = 0; i < 2; i++) {
        // Login unsuccessful for first 2 attempts
        await waitFor(() => user.click(screen.getByTestId("loginButton")));
        expect(screen.getByText(/Login unsuccessful, username and password required./)).toBeInTheDocument();
    }

    await waitFor(() => user.click(screen.getByTestId("loginButton")));
    expect(screen.getByText(/Login unsuccessful, username and password required./)).toBeInTheDocument();

    // Account blocked and timer is shown.
    expect(screen.getByTestId("confirmation-message").textContent).toEqual("Account blocked.");
    expect(screen.getByTestId("popup-timer")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("popup-timer")).toHaveTextContent("Try again in 30 seconds"));

    //  Timer will count down.
    await waitFor(() => {
        // Check that the timer has decreased by 5
        expect(screen.getByTestId("popup-timer")).toHaveTextContent("27");
    }, {timeout: 4000});

    // Change back to the default timeout
    jest.setTimeout(5000);

});

test('Unsuccessful login 3 times in a row and close popup', async () => {
    jest.useFakeTimers();
    render(<App/>, {wrapper: BrowserRouter});

    fetchMock.mockResponseOnce(JSON.stringify({ data: "Account blocked." }));

    // Input username and password
    userEvent.type(screen.getByTestId('username'), 'testuser');
    userEvent.type(screen.getByTestId('password'), 'testpassword');
    await waitFor(() => userEvent.click(screen.getByTestId("loginButton")));

    // Expect account blocked message and timer
    expect(screen.getByTestId("confirmation-message").textContent).toEqual("Account blocked.");
    await waitFor(() => {
        expect(screen.getByTestId('popup-timer')).toHaveTextContent('Try again in 30 seconds');
    });

    // Wait 31 seconds and close button shows
    jest.advanceTimersByTime(31000);
    await waitFor(() => {
        expect(screen.getByTestId("popup-timer")).toHaveTextContent("Try again in 0 seconds");
    });
    expect(screen.getByTestId("popup-close-button")).toBeInTheDocument();

    // Close pop-up and values should be reset.
    userEvent.click(screen.getByTestId('popup-close-button'));
    await waitFor(() => {
        expect(screen.queryByTestId('confirmation-container')).toBeNull();
    });

    jest.useRealTimers();
});