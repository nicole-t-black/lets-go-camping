import React from "react";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import ParkSearchResults from "../components/ParkSearchResults"; // Adjust the import path as necessary
import ParkDetails from "../components/ParkDetails";

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

describe('ParkSearchResults Component', () => {
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

    test('renders park search results correctly', () => {
        render(<ParkSearchResults park={mockPark} />);

        expect(screen.getByText(mockPark.fullName)).toBeInTheDocument();

        if (mockPark.images.length > 0) {
            expect(screen.getByRole('img', { name: mockPark.images[0].altText })).toHaveAttribute('src', mockPark.images[0].url);
        }
    });

    test("enter key for !suggest display details", async () => {
        render(<ParkSearchResults park={mockPark} suggest="" />);

        expect(screen.getByText(mockPark.fullName)).toBeInTheDocument();
        await waitFor( () => fireEvent.keyDown(screen.getByText(mockPark.fullName), { key: 'Enter' }));
        await waitFor(() => expect(render(<ParkDetails park={mockPark}/>)));
    });

    test("enter key for suggest display details", async () => {
        render(<ParkSearchResults park={mockPark} suggest="suggesting" />);

        expect(screen.getByText(mockPark.fullName)).toBeInTheDocument();
        await waitFor( () => fireEvent.keyDown(screen.getByText(mockPark.fullName), { key: 'Enter' }));
        await waitFor(() => expect(render(<ParkDetails park={mockPark}/>)));
    });


});
