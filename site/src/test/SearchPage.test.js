import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage";
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

test("SearchPage renders with title and search bar", async () => {
    render(<SearchPage />, { wrapper: BrowserRouter });

    const titleElement = screen.getByText(/Search For National Parks Here/i);
    expect(titleElement).toBeInTheDocument();

    const searchBarElement = screen.getByPlaceholderText(/search.../i); // Adjust this based on your SearchBar implementation
    expect(searchBarElement).toBeInTheDocument();
});

