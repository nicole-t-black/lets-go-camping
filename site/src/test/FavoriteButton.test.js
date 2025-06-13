import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import FavoriteButton from '../components/FavoriteButton';  // Adjust the import path if necessary

// Enable fetch mocking
fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});  // Mock window.alert

});

test('clicking the favorite button triggers a fetch request', async () => {
    // Mock the fetch request
    fetch.mockResponseOnce(JSON.stringify({ message: 'Favorite added successfully!' }));

    // Render the FavoriteButton component
    render(<FavoriteButton park={{ parkCode: 'park1' }} />);

    // Simulate a button click
    userEvent.click(screen.getByRole('button'));

    // Wait for the fetch request to resolve
    await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/addFavorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: 1,
                parkCode: 'park1',
            }),
        });
    });

});

test('handles network error properly', async () => {
    fetch.mockReject(new Error('Network response was not ok'));

    render(<FavoriteButton park={{ parkCode: 'park1' }} />);
    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(window.alert).toHaveBeenCalledWith('Error adding favorite');
});

test('handles failure in network request', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: false }), { status: 400 });

    render(<FavoriteButton park={{ parkCode: 'park1' }} />);
    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(window.alert).toHaveBeenCalledWith('Error adding favorite');
});