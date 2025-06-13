import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import FavoritesPage from "../pages/FavoritesPage";
import App from "../App";
import userEvent from "@testing-library/user-event";


fetchMock.enableMocks();
const user = userEvent.setup();

const successfully_fetched_favs_yell_yose =
    JSON.stringify({
        data: "Successfully fetched favorites.",
        favListIsPrivate: null,
        favorites: ['yell', 'yose']
    });

const successfully_fetched_favs_yose_yell =
    JSON.stringify({
        data: "Successfully fetched favorites.",
        favListIsPrivate: null,
        favorites: ['yose', 'yell']
    });

const successfully_fetched_favs_yose =
    JSON.stringify({
        data: "Successfully fetched favorites.",
        favListIsPrivate: null,
        favorites: ['yose']
    });

const successfully_fetched_favs_yell =
    JSON.stringify({
        data: "Successfully fetched favorites.",
        favListIsPrivate: null,
        favorites: ['yell']
    });

const successfully_fetched_no_favorites =
    JSON.stringify({
        data: "No favorites. Add parks from the search page.",
        favListIsPrivate: null,
        favorites: []
    });

const successful_visibility_true =
    JSON.stringify({
        data: 'Successfully fetched visibility.',
        favListIsPrivate: true,
    });

const yellowstone_park =
    JSON.stringify({
        data: [
            {
                parkCode: 'yell',
                fullName: 'Yellowstone National Park',
                addresses: [{ stateCode: 'WY' }],
                activities: [{ name: 'Arts and Culture' }, { name: 'Auto and ATV' }],
                images: [{
                    url: 'https://www.nps.gov/yell/planyourvisit/images/YS_1.jpg',
                    altText: 'Geysers of Yellowstone' }]
            },
        ]
    });

const yosemite_park =
    JSON.stringify({
        data: [
            {
                parkCode: 'yose',
                fullName: 'Yosemite National Park',
                addresses: [{stateCode: 'CA'}],
                activities: [{name: 'Hiking'}, {name: 'Camping'}],
                images: [{
                    url: 'https://www.nps.gov/common/uploads/structured_data/05383E91-AA28-2DDC-AB517507594F9FA6.jpg',
                    altText: 'Upper Yosemite Fall and Merced River in spring'
                }]
            },
        ]
    });

const empty_list = JSON.stringify({ data: [] });

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});


// Open App and sign in a user
beforeEach(async () => {
    render(<App/>, { wrapper: BrowserRouter });
    fetch.resetMocks();

    fetch.mockResponseOnce(JSON.stringify({ data: "Login successful." }));

    // verify page content for default route and redirect to sign up
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();

    //log user1 in
    await waitFor(() => user.type(screen.getByTestId("username"), "user"));
    await waitFor(() => user.type(screen.getByTestId("password"), "Password1"));
    await waitFor(() => user.click(screen.getByTestId("loginButton")));

    expect(fetch).toHaveBeenCalledTimes(1);

});

test("initially render the favorites page with no favorites", async () => {

    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_no_favorites,
        successful_visibility_true,

        // Mock response for first park
        empty_list,
        // favorites page API call
        empty_list,
        // Park search amenities API CALL
        empty_list
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
        expect(screen.getByText("No parks in favorites. Add some parks.")).toBeInTheDocument();
    });
});

test("error fetch favorites", async () => {
    fetchMock.mockResponses(
        // failed fetch favorites mock
        JSON.stringify({
            data: "Failed to fetch favorites.",
            favListIsPrivate: null,
            favorites: []
        }),

        // fetch visibility mock
        successful_visibility_true,
    );

    console.log = jest.fn();
    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith('Could not fetch favorites.');
    });

});

test("render favorites page only Yellowstone", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell,
        successful_visibility_true,

        // Mock response for Yellowstone
        yellowstone_park,
        empty_list,
        empty_list
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // Expect to see Yellowstone on favorites page
    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();

        // expect to see the move up and down arrows
        expect(screen.getByTestId("moveUpButton-yell")).toBeInTheDocument();
        expect(screen.getByTestId("moveDownButton-yell")).toBeInTheDocument();

        // expect to see remove all button
        expect(screen.getByTestId("removeAllFavoritesButton")).toBeInTheDocument();
        expect(screen.getByText("Remove All Favorites")).toBeInTheDocument();
    });

});

test("remove only yellowstone on favorite pages to become empty", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell,
        successful_visibility_true,

        // Mock response for yellowstone and amenities fetch call
        yellowstone_park,

        // remove favorite fetch
        JSON.stringify({
            data: 'Remove favorite successful.',
            favListIsPrivate: true,
            favorites: [],
        }),

        // re-fetch of favorites
        successfully_fetched_no_favorites,
        empty_list,
        empty_list
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // Assert that the park details are rendered
    await waitFor(() => {
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
    });

    // Expect that remove and confirmation buttons are present
    await expect_removal_confirmation_buttons_yell();

    // confirmation of removal
    await waitFor(() => user.click(screen.getByTestId("confirmRemoveButton")));
    await waitFor(() => {
        expect(screen.getByText("No parks in favorites. Add some parks.")).toBeInTheDocument();
    });
});


test("cancel the removal of yellowstone and expect it to stay on favorites page", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell,
        successful_visibility_true,

        // Mock response for yellowstone and amenities mock call
        yellowstone_park,
        empty_list,
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
    });

    await expect_removal_confirmation_buttons_yell();

    await waitFor(() => user.click(screen.getByTestId("confirmNoRemoveButton")));
    expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();

});

test("remove all parks on favorite pages to become empty", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        // Mock response for yellowstone and yosemite
        yellowstone_park,
        yosemite_park,


        // clear all favorites
        JSON.stringify({
            data: 'Clear favorites successful.',
            favListIsPrivate: true,
            favorites: [],
        }),

        // re-fetch of favorites
        successfully_fetched_no_favorites,
        empty_list,
        empty_list
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // Wait for the fetch requests to resolve
    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    // Expect that remove and confirmation buttons are present
    await waitFor(() => {
        user.click(screen.getByTestId("removeAllFavoritesButton"));
        expect(screen.getByText(/Are you sure you want to remove all favorites?/)).toBeInTheDocument();
        expect(screen.getByTestId("confirmRemoveAllButton")).toBeInTheDocument();
        expect(screen.getByTestId("confirmNoRemoveAllButton")).toBeInTheDocument();
    });

    // confirmation of removal
    await waitFor(() => user.click(screen.getByTestId("confirmRemoveAllButton")));
    await waitFor(() => {
        expect(screen.getByText("No parks in favorites. Add some parks.")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith("/clearFavorites", expect.anything());
});

test("cancel the removal of all parks and expect park to stay on favorites page", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yose,
        successful_visibility_true,

        yosemite_park,

        empty_list,
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    // Expect that remove and confirmation buttons are present
    await waitFor(() => {
        user.click(screen.getByTestId("removeAllFavoritesButton"));
        expect(screen.getByTestId("confirmNoRemoveAllButton")).toBeInTheDocument();
    });

    // confirmation of removal
    await waitFor(() => user.click(screen.getByTestId("confirmNoRemoveAllButton")));
    await waitFor(() => {
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });
});

test("change visibility from private to public", async () => {

    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_no_favorites,
        successful_visibility_true,

        // Mock response for first park
        empty_list,
        // Park search amenities API CALL
        empty_list,

        JSON.stringify({
            data: "Favorites visibility toggled.",
            favListIsPrivate: false,
        })

    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText("No parks in favorites. Add some parks.")).toBeInTheDocument();
    });


    expect(screen.getByText("Private")).toBeInTheDocument();
    await waitFor(() => {
        user.click(screen.getByTestId("togglePrivateButton"));
        expect(screen.getByText("Public")).toBeInTheDocument();
    });
});

test("change visibility from public to private", async () => {

    fetchMock.mockResponses(
        // fetch favorites mock
        successfully_fetched_no_favorites,

        // fetch public visibility mock
        JSON.stringify({
            data: 'Successfully fetched visibility.',
            favListIsPrivate: false,
        }),

        empty_list,
        empty_list,

        // visibility toggled to private
        JSON.stringify({
            data: "Favorites visibility toggled.",
            favListIsPrivate: true,
        })

    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        fireEvent.click(screen.getByTestId("togglePrivateButton"));
    });

    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/toggleVisibility", expect.anything());
        expect(screen.getByTestId("togglePrivateButton").textContent).toBe("Private");
    });

});

test("error fetching visibility", async () => {

    fetchMock.mockResponses(
        // fetch favorites mock
        successfully_fetched_no_favorites,

        // fetch visibility mock
        JSON.stringify({
            data: 'Could not fetch visibility.',
        }),

        // Mock response for first park
        empty_list,
        empty_list,
    );

    console.log = jest.fn();
    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    await waitFor(() => {
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
        expect(screen.getByText("No parks in favorites. Add some parks.")).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Couldn't set favorite list visibility.");
    });
});

test("move Yellowstone Park down", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        // Mock response for yellowstone and yosemite
        yellowstone_park,
        yosemite_park,


        // move park down fetch
        JSON.stringify({
            data: "Move park down successful.",
            favListIsPrivate: true,
            favorites: ['yose', 'yell'],
        }),

        // re-fetch of favorites
        successfully_fetched_favs_yose_yell,

        yosemite_park,
        yellowstone_park,

        //Move park down
        JSON.stringify({
            data: "Move park up successful.",
            favListIsPrivate: true,
            favorites: ['yell', 'yose'],
        }),

        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        yellowstone_park,
        yosemite_park,
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // Wait for the fetch requests to resolve
    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    // Expect that move up and down buttons are present
    await waitFor(() => {
        expect(screen.getByTestId("moveUpButton-yell")).toBeInTheDocument();
        expect(screen.getByTestId("moveDownButton-yell")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("moveDownButton-yell"));

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
    });

    await waitFor( () => fireEvent.keyDown(screen.getByTestId('moveUpButton-yell'), { key: 'Enter' }));

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

});

test("move Yosemite Park up", async () => {
    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        yellowstone_park,
        yosemite_park,

        // move park up fetch
        JSON.stringify({
            data: "Move park up successful.",
            favListIsPrivate: true,
            favorites: ['yose', 'yell'],
        }),

        // re-fetch of favorites
        successfully_fetched_favs_yose_yell,

        yosemite_park,
        yellowstone_park,

        //Move park down
        JSON.stringify({
            data: "Move park down successful.",
            favListIsPrivate: true,
            favorites: ['yell', 'yose'],
        }),

        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        yellowstone_park,
        yosemite_park,

    );

    render(<FavoritesPage />);

    // Wait for the fetch requests to resolve
    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    // Expect that move up and down buttons are present
    await waitFor(() => {
        expect(screen.getByTestId("moveUpButton-yose")).toBeInTheDocument();
        expect(screen.getByTestId("moveDownButton-yose")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("moveUpButton-yose"));

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
    });

    await waitFor( () => fireEvent.keyDown(screen.getByTestId('moveDownButton-yose'), { key: 'Enter' }));

    await waitFor(() => {
        // Assert that the park details are rendered
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });
});

test("error when moving Yellowstone Park down", async () => {
    fetchMock.mockResponses(

        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        yellowstone_park,
        yosemite_park,

        empty_list,
        empty_list,

        // Move park down fetch with an error
        JSON.stringify({
            data: "Failed to move park down.",
            favListIsPrivate: true,
            favorites: ['yell', 'yose']
        }),

        JSON.stringify({
            data: "Successfully fetched favorites.",
            favListIsPrivate: true,
            favorites: ['yell', 'yose']
        }),

        yellowstone_park,
        yosemite_park,

        empty_list,
        empty_list

    );

    render(<FavoritesPage />);

    // Wait for the fetch requests to resolve
    await waitFor(() => {
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    // Expect that move down button is present
    await waitFor(() => {
        expect(screen.getByTestId("moveDownButton-yell")).toBeInTheDocument();
    });

    // Simulate a click on the move down button for Yellowstone
    await user.click(screen.getByTestId("moveDownButton-yell"));

    // Since we expect an error, assert that the order has not changed
    await waitFor(() => {
        expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument();
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });
});

test("multiple errors thrown", async () => {
    // "Could not change favorites list visibility."
    // "Remove favorite successful."
    // "Could not clear all favorites."

    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        // Mock response for yellowstone and yosemite
        yellowstone_park,
        yosemite_park,

        // amenities fetch call for both parks
        empty_list,
        empty_list,
        empty_list,

        // Unable to change visibility
        JSON.stringify({
            data: "Could not change favorites list visibility.",
            favListIsPrivate: true,
        }),

        // remove favorite fetch
        JSON.stringify({
            data: 'Remove favorite successful.',
            favListIsPrivate: true,
            favorites: ['yose'],
        }),

        // refetch of favorites
        successfully_fetched_favs_yose,
        yosemite_park,
        empty_list,

        JSON.stringify({
            data: 'Could not clear all favorites.',
            favListIsPrivate: true,
            favorites: ['yose'],
        }),

        // re-fetch of favorites
        successfully_fetched_favs_yose,
        yosemite_park,
        empty_list

    );

    console.log = jest.fn();
    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // expect error in changing visibility
    expect(screen.getByText("Private")).toBeInTheDocument();
    await waitFor(() => {
        user.click(screen.getByTestId("togglePrivateButton"));
        expect(screen.getByText("Private")).toBeInTheDocument();
        expect(console.log).toHaveBeenCalledWith("Could not change favorites list visibility.");
    });

    // Expect that remove and confirmation buttons are present
    await expect_removal_confirmation_buttons_yell();

    // confirmation of correct removal
    await waitFor(() => user.click(screen.getByTestId("confirmRemoveButton")));
    await waitFor(() => {
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith("/removeFavorite", expect.anything());

    // Expect that clear all confirmation buttons are present
    await waitFor(() => {
        user.click(screen.getByTestId("removeAllFavoritesButton"));
        expect(screen.getByText(/Are you sure you want to remove all favorites?/)).toBeInTheDocument();
        expect(screen.getByTestId("confirmRemoveAllButton")).toBeInTheDocument();
    });

    // expect confirmation of clear all to fail.
    await waitFor(() => user.click(screen.getByTestId("confirmRemoveAllButton")));
    await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Could not clear all favorites.");
    });

    // Expect fetching favorites to fail.
    await waitFor(() => {
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });

});


test("move park up and remove favorite", async () => {
    // "Move park up successful."
    // "Remove favorite successful."

    fetchMock.mockResponses(
        // fetch favorites and visibility mock
        successfully_fetched_favs_yell_yose,
        successful_visibility_true,

        // Mock response for yellowstone and yosemite
        yellowstone_park,
        yosemite_park,

        // amenities fetch call for both parks
        JSON.stringify({data: []}),
        JSON.stringify({data: []}),

        // move park up fetch
        JSON.stringify({
            data: "Move park up successful.",
            favListIsPrivate: true,
            favorites: ['yose', 'yell'],
        }),

        // refetch of favorites
        successfully_fetched_favs_yose_yell,

        yosemite_park,
        yellowstone_park,

        empty_list,
        empty_list,

        // remove favorite fetch
        JSON.stringify({
            data: 'Remove favorite successful.',
            favListIsPrivate: true,
            favorites: ['yose'],
        }),

        // refetch of favorites
        successfully_fetched_favs_yose,
        yosemite_park,

        // favorites page API call
        empty_list
    );

    render(<FavoritesPage/>, { wrapper: BrowserRouter });

    // Expect to see Yosemite on favorites page
    await waitFor(() => {
        // Assert that the park details are rendered and buttons are visible
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
        expect(screen.getByTestId("moveUpButton-yose")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("moveDownButton-yell"));

    // Expect that remove and confirmation buttons are present
    await expect_removal_confirmation_buttons_yell();

    // confirmation of removal
    await waitFor(() => user.click(screen.getByTestId("confirmRemoveButton")));
    await waitFor(() => {
        expect(screen.getByText("Yosemite National Park")).toBeInTheDocument();
    });
});

async function expect_removal_confirmation_buttons_yell() {
    await waitFor(() => user.click(screen.getByTestId("removeFavoriteButton-yell")));
    expect(screen.getByText(/Are you sure you want to remove from favorites?/)).toBeInTheDocument();
    expect(screen.getByTestId("confirmRemoveButton")).toBeInTheDocument();
    expect(screen.getByTestId("confirmNoRemoveButton")).toBeInTheDocument();
}