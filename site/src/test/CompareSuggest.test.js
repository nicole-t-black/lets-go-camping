import React from "react";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();
const user = userEvent.setup();

const success_add =
    JSON.stringify({ data: "Successfully Added User"});

const empty_list = JSON.stringify({ data: [] });

const yosemite =
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

const zion =
    JSON.stringify({
        data: [
            {
                parkCode: 'zion',
                fullName: 'Zion National Park',
                addresses: [{stateCode: 'UT'}],
                activities: [{name: 'Biking'}, {name: 'Camping'}],
                images: [{
                    url: 'https://www.nps.gov/common/uploads/structured_data/68BFC1AC-BF96-629F-89D261D78F181C64.jpg',
                    altText: 'A triangular sandstone mountain overlooks green and yellow foliage. A cloudy blue sky is overhead.'
                }]
            },
        ]
    });

const joshua_tree =
    JSON.stringify({
        data: [
            {
                parkCode: 'jotr',
                fullName: 'Joshua Tree National Park',
                addresses: [{stateCode: 'CA'}],
                activities: [{name: 'Biking'}, {name: 'Camping'}],
                images: [{
                    url: 'https://www.nps.gov/common/uploads/structured_data/306D0D93-9CCA-76E1-AD48268F8D7A7E3E.jpg',
                    altText: 'The sky turns hues of pink and purple over a field of Joshua trees.'
                }]
            },
        ]
    });

const death_valley =
    JSON.stringify({
        data: [
            {
                parkCode: 'deva',
                fullName: 'Death Valley National Park',
                addresses: [{stateCode: 'CA'}],
                activities: [{name: 'Biking'}, {name: 'Camping'}],
                images: [{
                    url: 'https://www.nps.gov/common/uploads/structured_data/010A933C-95B1-CBCD-D6D64D47D5B81E76.jpg',
                    altText: 'badlands bathed in pale pink and orange light from the setting sun'
                }]
            },
        ]
    });

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});

beforeEach(async () => {
    render(<App/>, { wrapper: BrowserRouter });
    fetch.resetMocks();

    fetch.mockResponseOnce(JSON.stringify({ data: "Login successful." }));

    // verify page content for default route and redirect to sign up
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();

    //log user1 in
    await waitFor(() => user.type(screen.getByTestId("username"), "user0test"));
    await waitFor(() => user.type(screen.getByTestId("password"), "Password1"));
    await waitFor(() => user.click(screen.getByTestId("loginButton")));

    expect(fetch).toHaveBeenCalledTimes(1);

    //have user navigate to compare-suggest page
    await waitFor(() => user.click(screen.getByTestId("compare-suggest")));
});

//test page renders with all components
test("CompareSuggestPage renders with title, UserSearch, and CompareSuggest", async () => {
    //title
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //UserSearch
    expect(screen.getByPlaceholderText(/Search for a user/)).toBeInTheDocument();

    //CompareSuggest
    expect(screen.getByTestId("compare")).toBeInTheDocument();
});

//clearing blank list test
test("clearing already blank list", async () => {
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //click clear button
    await waitFor(() => user.click(screen.getByTestId('clear')));

    //expect List cleared
    expect(screen.getByText(/List Cleared/i)).toBeInTheDocument();
});

/* USER TESTS */

//test adding blank text box
test("adding user fails because text box is blank", async () => {

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //click add without adding a username
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/Please enter a username/i)).toBeInTheDocument();

});

//test invalid user is put in search bar and added
test("adding user fails because user DNE", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Invalid Username: user does not exist" }));
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type invalid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), '2'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect error message
    expect(screen.getByText(/user does not exist/i)).toBeInTheDocument();

    //expect API call to have been made
    expect(fetch).toHaveBeenCalledTimes(2);
});

//test user with private list
test("adding user fails because list is private", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Invalid Username: user's list is private" }));
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type user with private list and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user3test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect error message
    expect(screen.getByText(/user's list is private/i)).toBeInTheDocument();

    //expect API call to have been made
    expect(fetch).toHaveBeenCalledTimes(2);
});

//adding a valid user
test("successfully adding a user", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "Successfully Added User" }));

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/Successfully Added User/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(2);
});

//failed fetch request
test("failed fetch request", async () => {
    fetch.mockRejectOnce(new Error("An error occurred while fetching data."));

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(2);

});

/* COMPARE TESTS */

//clicking compare without adding any users
test("clicking compare without adding users", async () => {
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('compare')));

    //expect message
    expect(screen.getByText(/please add user/i)).toBeInTheDocument();
});

//failed fetch request for compare
test("failed fetch request for compare", async () => {
    fetch.mockResponseOnce(success_add);
    fetch.mockRejectOnce(new Error("An error occurred while fetching data."));

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByTestId('compare')));

    expect(screen.getByText(/error occurred while fetching data/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(3);

});

//adding a valid user and clicking compare
test("adding a user and comparing", async () => {
    fetchMock.mockResponses(
        success_add,
        [JSON.stringify({ data: "Compare Results Successful", results: { "yose": 2, "zion": 2 }})],

        yosemite,
        zion,
        empty_list,
        empty_list
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('compare')));

    //expect Yosemite and Zion
    await waitFor(() => {
        expect(screen.getByText(/Yosemite National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Zion National Park/)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(5);
});

//adding valid users, clearing list, then clicking compare
test("clearing list of users and comparing", async () => {

    fetchMock.mockResponses(
        success_add,
        success_add,
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to add valid users and click clear
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.type(screen.getByTestId('uname'), 'user4test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click clear to clear list
    await waitFor(() => user.click(screen.getByTestId('clear')));
    expect(screen.getByText(/list cleared/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('compare')));

    //expect add user message
    expect(screen.getByText(/please add user/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(3);
});

//compare list of users and hover over ratio
test("comparing users, hover over ratio and remove hover", async () => {
    fetchMock.mockResponses(
        success_add,
        success_add,
        [JSON.stringify({ data: "Compare Results Successful",
            results: { "zion": 3, "yose": 2, "deva": 1 },
            parkUsers: { "zion": ['user0test', 'user1test', 'user7test'], "yose": ['user0test', 'user1test'], "deva": ['user7test'] }})],

        zion,
        yosemite,
        death_valley,
        empty_list,
        empty_list,
        empty_list
    );
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to add valid users
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.type(screen.getByTestId('uname'), 'user7test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('compare')));

    //expect Zion, Yosemite, and Death Valley
    await waitFor(() => {
        expect(screen.getByText(/Zion National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Yosemite National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Death Valley National Park/)).toBeInTheDocument();
        expect(screen.getByTestId('showUsers-zion')).toBeInTheDocument();
        expect(screen.getByTestId('showUsers-yose')).toBeInTheDocument();
        expect(screen.getByTestId('showUsers-deva')).toBeInTheDocument();
    });

    //hover over Yosemite ratio
    await waitFor(() => user.hover(screen.getByTestId('showUsers-yose')));
    expect(screen.getByTestId('users-yose')).toBeInTheDocument();
    //stop hovering over Yosemite ratio
    await waitFor(() => user.unhover(screen.getByTestId('showUsers-yose')));
    await waitFor( () => fireEvent.focus(screen.getByTestId('showUsers-zion')));
    expect(screen.getByTestId('users-zion')).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(7);
});

//user clicks on park to display details
test("add users with enter key, comparing, and displaying details", async () => {
    fetchMock.mockResponses(
        success_add,
        success_add,
        [JSON.stringify({ data: "Compare Results Successful",
            results: { "zion": 3, "yose": 2, "deva": 1 }})],

        zion,
        yosemite,
        death_valley,
        empty_list,
        empty_list,
        empty_list
    );
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to add valid users
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => fireEvent.keyDown(screen.getByTestId('uname'), { key: 'Enter' }));
    await waitFor ( () => {
        expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();
    });

    await waitFor(() => user.type(screen.getByTestId('uname'), 'user7test'));
    await waitFor(() => fireEvent.keyDown(screen.getByTestId('uname'), { key: 'Enter' }));
    await waitFor ( () => {
        expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();
    });

    //click compare
    await waitFor(() => user.click(screen.getByTestId('compare')));

    //expect Yosemite and Zion
    await waitFor (() => {
        expect(screen.getByText(/Zion National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Yosemite National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Death Valley National Park/)).toBeInTheDocument();
    })

    //click park name
    await waitFor(() => user.click(screen.getByText(/Yosemite National Park/)));
    expect(screen.getByText(/Visit Park Website/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(9);

});



/* SUGGEST TESTS */

//click suggest without adding any users
test("clicking suggest without adding users", async () => {
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //click suggest
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect message
    expect(screen.getByText(/please add user/i)).toBeInTheDocument();
});

//click suggest after adding user and clearing list
test("clearing list of users and suggesting", async () => {
    fetchMock.mockResponses(
        success_add,
        success_add,
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to add valid users and click clear
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.type(screen.getByTestId('uname'), 'user4test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click clear to clear list
    await waitFor(() => user.click(screen.getByTestId('clear')));
    expect(screen.getByText(/list cleared/i)).toBeInTheDocument();

    //click suggest
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect add user message
    expect(screen.getByText(/please add user/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(3);
});

//failed fetch response for suggest
test("failed fetch request for suggest", async () => {
    fetch.mockResponseOnce(success_add);
    fetch.mockRejectOnce(new Error("An error occurred while fetching data."));

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByTestId('suggest')));

    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(3);

});

//click suggest after adding valid users with common parks
test("adding users and suggesting park", async () => {
    fetchMock.mockResponses(
        success_add,
        success_add,
        [JSON.stringify({ data: "100% match", suggest: ['yose'] })],

        yosemite,
        empty_list
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user5test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect Yosemite and Zion
    await waitFor(() => {
        expect(screen.getByText(/Yosemite National Park/)).toBeInTheDocument();
    });

    //need to add expect for correct pictures!!!!!

    expect(fetch).toHaveBeenCalledTimes(5);
});

//click suggest after adding user with no common parks
test("adding a user and no suggestion", async () => {
    fetchMock.mockResponses(
        success_add,
        [JSON.stringify({ data: "No Suggestions Found", suggest: [] })]
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user4test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect Yosemite and Zion
    await waitFor(() => {
        expect(screen.getByText(/No Suggestions Found/)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(3);
});

//adding users that have more than one common highest rated park
test("more than one park suggestion", async () => {
    fetchMock.mockResponses(
        success_add,
        [JSON.stringify({ data: "100% match", suggest: ['yose', 'zion'] })],

        yosemite,
        zion,
        empty_list,
        empty_list
    );

    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to type valid user and click add
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user6test'));
    await waitFor(() => user.click(screen.getByTestId('add')));

    //expect message
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect Yosemite and Zion
    await waitFor(() => {
        expect(screen.getByText(/Yosemite National Park/)).toBeInTheDocument();
        expect(screen.getByText(/Zion National Park/)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(5);
});

//clicking display details after suggestion is loaded
test("click display details on suggestion", async () => {
    fetchMock.mockResponses(
        success_add,
        success_add,
        [JSON.stringify({ data: "100% match", suggest: ['zion']})],

        zion,
        empty_list
    );
    //on correct page
    expect(screen.getByText(/Compare and Suggest Parks with Friends/)).toBeInTheDocument();

    //wait for user to add valid users
    await waitFor(() => user.type(screen.getByTestId('uname'), 'user1test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    await waitFor(() => user.type(screen.getByTestId('uname'), 'user7test'));
    await waitFor(() => user.click(screen.getByTestId('add')));
    expect(screen.getByText(/successfully added user/i)).toBeInTheDocument();

    //click compare
    await waitFor(() => user.click(screen.getByTestId('suggest')));

    //expect Yosemite and Zion
    await waitFor (() => {
        expect(screen.getByText(/Zion National Park/)).toBeInTheDocument();
    })

    //click park name
    await waitFor(() => user.click(screen.getByText(/Zion National Park/)));
    expect(screen.getByText(/Visit Park Website/i)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(7);
});

