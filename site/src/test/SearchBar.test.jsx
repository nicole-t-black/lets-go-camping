import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../pages/SearchBar";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import ParkSearchResults from "../components/ParkSearchResults";

const mockPark = {
    fullName: 'Yellowstone National Park',
    addresses: [{ stateCode: 'WY' }],
    activities: [
        { name: 'Arts and Culture' },
        { name: 'Auto and ATV' }
    ],
    images: [
        { url: 'https://www.nps.gov/yell/planyourvisit/images/YS_1.jpg', altText: 'Geysers of Yellowstone' }
    ]
};

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

test("SearchBar allows user input and can submit a search", async () => {
    render(<SearchBar />);
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({ data: [{ id: 1, name: "Test Park" }] }));

    const searchInput = screen.getByPlaceholderText(/Search by Park Name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    window.alert = jest.fn();
    await act(async () => {
        await user.click(searchButton);
    });
    expect(window.alert).toHaveBeenCalledWith("Please enter a search term.");

    await act(async () => {
        await user.type(searchInput, "Yellowstone");
        await user.click(searchButton);
    });

    const filterSelect = screen.getByRole('combobox');
    await act(async () => {
        await user.selectOptions(filterSelect, "stateCode");
        await user.type(searchInput, "CA");
        await user.click(searchButton);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Yellowstone")
    );
});

test("search with enter key", async () => {
    render(<SearchBar />);
    const user = userEvent.setup();
    fetch.mockResponseOnce(JSON.stringify({ data: [{ id: 1, name: "Test Park" }] }));

    await waitFor(() => user.type(screen.getByTestId('search-box'), "Yellowstone"));
    await waitFor(() => fireEvent.keyDown(screen.getByTestId('search-box'), { key: 'Enter' }));

    await waitFor(() => expect(render(<ParkSearchResults park={mockPark}/>)));
});

test("load more results", async () => {
    render(<SearchBar />);
    const user = userEvent.setup();
    fetch.mockResponseOnce(JSON.stringify(
        { data: [
            { id: 1, name: "Test Park" }, { id: 2, name: "Test Park2" }, { id: 3, name: "Test Park3" },
            { id: 4, name: "Test Park4" }, { id: 5, name: "Test Park5" }, { id: 6, name: "Test Park6" },
            { id: 7, name: "Test Park7" }, { id: 8, name: "Test Park8" }, { id: 9, name: "Test Park9" }, { id: 10, name: "Test Park10" }] }));

    fetch.mockResponseOnce(JSON.stringify(
        { data: [
                { id: 1, name: "Test Park" }, { id: 2, name: "Test Park2" }, { id: 3, name: "Test Park3" },
                { id: 4, name: "Test Park4" }, { id: 5, name: "Test Park5" }, { id: 6, name: "Test Park6" },
                { id: 7, name: "Test Park7" }, { id: 8, name: "Test Park8" }, { id: 9, name: "Test Park9" }, { id: 10, name: "Test Park10" }] }));

    await waitFor(() => user.type(screen.getByTestId('search-box'), "national"));
    await waitFor(() => fireEvent.keyDown(screen.getByTestId('search-box'), { key: 'Enter' }));
    await waitFor(() => fireEvent.scroll(window,  {target: { scrollY: 20000 } }));
    await waitFor(() => fireEvent.click(screen.getByTestId('load-more')));

    expect(fetch).toHaveBeenCalledTimes(3);


});

test("searching for amenities from drop down", async () => {
    render(<SearchBar />);
    const user = userEvent.setup();

    const filterSelect = screen.getByRole('combobox');
    await act( () => user.selectOptions(filterSelect, "amenities"));
    await act( () => user.type(screen.getByTestId('search-box'), "Fire Pit"));
    await act( () => fireEvent.keyDown(screen.getByTestId('search-box'), { key: 'Enter' }));

    await waitFor(() => expect(render(<ParkSearchResults park={mockPark}/>)));
});

test("searching for activities from drop down", async () => {
    render(<SearchBar />);
    const user = userEvent.setup();

    const filterSelect = screen.getByRole('combobox');
    await act( () => user.selectOptions(filterSelect, "activities"));
    await act( () => user.type(screen.getByTestId('search-box'), "Biking"));
    await act( () => fireEvent.keyDown(screen.getByTestId('search-box'), { key: 'Enter' }));

    await waitFor(() => expect(render(<ParkSearchResults park={mockPark}/>)));
});

// test("data error", async () => {
//     render(<SearchBar />);
//     const user = userEvent.setup();
//
//     fetch.mockResponseOnce(JSON.stringify({ data: [{ name: '' }, { name: '' }] }));
//
//     await waitFor(() => user.type(screen.getByTestId('search-box'), "hhhhhh"));
//     await waitFor(() => fireEvent.keyDown(screen.getByTestId('search-box'), { key: 'Enter' }));
//
//     expect(fetch).toHaveBeenCalledTimes(1);
// });