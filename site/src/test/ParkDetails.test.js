import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import ParkDetails from "../components/ParkDetails";
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

describe('ParkDetails Component', () => {
    const mockPark = {
        fullName: 'Yellowstone National Park',
        addresses: [{city: 'West Yellowstone', stateCode: 'MT', countryCode: 'US'}],
        url: 'https://www.nps.gov/yell/index.htm',
        description: 'Yellowstone National Park is a national park located in the U.S. states of Wyoming, Montana, and Idaho.',
        activities: [
            { name: 'Hiking' },
            { name: 'Fishing' },
            { name: 'Camping' }
        ],
        images: [
            { url: 'https://www.nps.gov/yell/planyourvisit/images/YS_1.jpg', altText: 'Geysers of Yellowstone' }
        ],
        Amenities: 'No amenities available',
        parkCode: 'yell'
    };

    test('renders park details correctly', () => {
        render(<ParkDetails park={mockPark} />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockPark.fullName);
        expect(screen.getByText(new RegExp(mockPark.addresses[0].city, 'i'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockPark.addresses[0].stateCode, 'i'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockPark.addresses[0].countryCode, 'i'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockPark.description, 'i'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockPark.activities.map(activity => activity.name).join(', '), 'i'))).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', mockPark.images[0].url);
        expect(screen.getByRole('img')).toHaveAttribute('alt', mockPark.images[0].altText);
    });

    test('renders park details correctly', () => {
        render(<ParkDetails park={mockPark} />);

        expect(screen.getByRole('heading', { name: mockPark.fullName })).toBeInTheDocument();

        // expect(screen.getByText((content, node) => {
        //     const hasText = (node) => node.textContent === "Location:";
        //     const nodeHasText = hasText(node);
        //     const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
        //
        //     return nodeHasText && childrenDontHaveText;
        // })).toBeInTheDocument();
        //
        // // check for the state code separately
        // expect(screen.getByText(new RegExp(`^${mockPark.addresses[0].stateCode}$`, 'i'))).toBeInTheDocument();
        //
        // const activitiesText = mockPark.activities.map(activity => activity.name).join(', ');
        // expect(screen.getByText(new RegExp(`${activitiesText}`, 'i'))).toBeInTheDocument();
        //
        // if (mockPark.images.length > 0) {
        //     expect(screen.getByRole('img', { name: mockPark.images[0].altText })).toHaveAttribute('src', mockPark.images[0].url);
        // }

        expect(screen.getByText('No amenities available')).toBeInTheDocument();
    });

    test('displays a message when no amenities are available', async () => {
        const mockPark = {
            parkCode: 'yell',
            fullName: 'Yellowstone National Park',
            addresses: [{ stateCode: 'WY' }],
            activities: [{ name: 'Hiking' }, { name: 'Fishing' }],
            images: [{ url: 'https://www.nps.gov/yell/planyourvisit/images/YS_1.jpg', altText: 'Geysers of Yellowstone' }]
        };

        fetch.mockResponseOnce(JSON.stringify({ data: [] }));

        render(<ParkDetails park={mockPark} />);

        await waitFor(() => {
            expect(screen.getByText('No amenities available')).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(
            `https://developer.nps.gov/api/v1/amenities/parksplaces?parkCode=${mockPark.parkCode}&api_key=AbsNMYjgoFTxspUU7emrVh0CurAHh4I8MrBMSHmC`
        );
    });

    test("mock park with amenities", async () => {
        const mockPark2 = {
            fullName: 'Yellowstone National Park',
            addresses: [{city: 'West Yellowstone', stateCode: 'MT', countryCode: 'US'}],
            url: 'https://www.nps.gov/yell/index.htm',
            description: 'Yellowstone National Park is a national park located in the U.S. states of Wyoming, Montana, and Idaho.',
            activities: [
                { name: 'Hiking' },
                { name: 'Fishing' },
                { name: 'Camping' }
            ],
            images: [
                { url: 'https://www.nps.gov/yell/planyourvisit/images/YS_1.jpg', altText: 'Geysers of Yellowstone' }
            ],
            Amenities: [
                { name: 'Accessible Rooms' },
                { name: 'Fire Pit' }
            ],
            parkCode: 'yell'
        };

        fetch.mockResponseOnce(JSON.stringify({ data: [{ name: 'Accessible Rooms' }, { name: 'Fire Pit' }] }));

        render(<ParkDetails park={mockPark2} />);

        await waitFor(() => {
            expect(screen.getByText('Accessible Rooms, Fire Pit')).toBeInTheDocument();
        });

    });
});
