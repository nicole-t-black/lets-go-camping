import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
const user = userEvent.setup();

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(async () => {
    render(<App/>, {wrapper: BrowserRouter});
    await waitFor(() => user.click(screen.getByText(/Sign Up/)));
    fetch.resetMocks();
});

test("navigate to and from sign up page", async () => {
    // verify page content for default route
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();
    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(document.getElementById("username")).toBeInTheDocument();
    expect(document.getElementById("password")).toBeInTheDocument();
    expect(document.getElementById("confirmPassword")).toBeInTheDocument();

    // verify page content for expected route after navigating
    await waitFor(() => user.click(screen.getByText(/Login/)));
    await waitFor(() => expect(screen.getByText(/Login Page/)).toBeInTheDocument());
    expect(screen.getByText(/Don't have an account/)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByText(/Sign Up/)));
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();
});


// Test the input handling and rendering for username and passwords
test("initially render the sign up page with input values", async () => {
    await user.type(screen.getByTestId("username"), "testUser");
    await user.type(screen.getByTestId("password"), "p@ssw0rd");
    await user.type(screen.getByTestId("confirmPassword"), "p@ssw0rd");

    expect(screen.getByTestId("username")).toHaveValue("testUser");
    expect(screen.getByTestId("password")).toHaveAttribute('value', 'p@ssw0rd');
    expect(screen.getByTestId("confirmPassword")).toHaveAttribute('value', 'p@ssw0rd');
});

// Test the login functionality with correct credentials and redirection to login page
test("test the sign up Submission With Correct Credentials.", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Sign up successful." }));

    // verify page content for default route
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();
    await waitFor(() => user.type(screen.getByTestId("username"), "testUser"));
    await waitFor(() => user.type(screen.getByTestId("password"), "validPassword1"));
    await waitFor(() => user.type(screen.getByTestId("confirmPassword"), "validPassword1"));

    await waitFor(() => user.click(screen.getByTestId("signUpButton")));
    await waitFor(() => expect(screen.getByText(/Login Page/)).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(1);
});

// Display messaging due to missing credentials
test("use missing credentials to test sign up submission", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Missing username and password. Please try again." }));

    await waitFor(() => user.click(screen.getByTestId("signUpButton")));
    expect(screen.queryByText("Missing username and password. Please try again.")).toBeInTheDocument();
});


// Test the cancel button functionality and confirm cancel then redirection to login page
test("confirm cancel and redirect to login page from sign up cancel button", async () => {
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByTestId("cancelButton")));
    expect(screen.queryByText("Are you sure you want to cancel?")).toBeInTheDocument();
    await waitFor(() => user.click(screen.getByTestId("confirmCancelButton")));
    await waitFor(() => expect(screen.getByText(/Login Page/)).toBeInTheDocument());
});

// Test the cancel button functionality and second cancel to stay on sign up page.
test("do not confirm cancel, remain on sign up page", async () => {
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByTestId("cancelButton")));
    expect(screen.queryByText("Are you sure you want to cancel?")).toBeInTheDocument();
    await waitFor(() => user.click(screen.getByTestId("confirmNoCancelButton")));
    expect(screen.getByText(/Sign Up Page/)).toBeInTheDocument();
});