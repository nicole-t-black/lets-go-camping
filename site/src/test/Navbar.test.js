import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import FavoritesPage from "../pages/FavoritesPage";

fetchMock.enableMocks();

afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

const user = userEvent.setup();

// Open App and sign in a user
beforeEach(async () => {
    render(<App/>, { wrapper: BrowserRouter });
    fetch.resetMocks();

    fetch.mockResponseOnce(JSON.stringify({ data: "Login successful." }));

    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    expect(screen.getByText(/Let's Go Camping!/)).toBeInTheDocument();

    await waitFor(() => user.type(screen.getByTestId("username"), "testUser"));
    await waitFor(() => user.type(screen.getByTestId("password"), "Password1"));
    await waitFor(() => user.click(screen.getByTestId("loginButton")));
});

test("navbar rendered when going to search page", async () => {
    // verify what is on search page
    expect(screen.getByText(/Search For National Parks Here/)).toBeInTheDocument();
    expect(screen.getByText(/Let's Go Camping!/)).toBeInTheDocument();
    expect(screen.getByText(/Group 11/)).toBeInTheDocument();
    expect(screen.getByText(/Favorites/)).toBeInTheDocument();
    expect(screen.getByText(/Let's Compare/)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/)).toBeInTheDocument();
});

test("navbar rendering on a phone screen and clicking on search", async () => {

    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        JSON.stringify({
            data: "No favorites. Add parks from the search page.",
            favListIsPrivate: null,
            favorites: []
        }),
        JSON.stringify({
            data: 'Successfully fetched visibility.',
            favListIsPrivate: true,
        }),

        JSON.stringify({ data: [] }),
        JSON.stringify({ data: [] }),
        JSON.stringify({ data: [] })
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => userEvent.click(screen.getByTestId("menu-button")));
    await waitFor(() => userEvent.click(screen.getByTestId("search")));

    await waitFor(() => userEvent.click(screen.getByTestId("menu-button")));
    expect(screen.getByText(/Favorites/)).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByTestId("favorites")));

    await waitFor(() => userEvent.click(screen.getByTestId("menu-button")));
    await waitFor(() => userEvent.click(screen.getByTestId("signOut")));
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
});