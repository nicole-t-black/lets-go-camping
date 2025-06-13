import React from "react";
/*
Info shown on briefing (in search):
Have:
    Name of park
    Location (city, county, state),
    Clickable park url (with national website),
    Picture associated with park,
    Brief description of park
    Activities provided
Need:
    Display entry fee
    Amenities provided - What endpoint to call?
Future:
    Label to show if/not on favorites list
 */
import {useEffect, useState} from "react";
import 'reactjs-popup/dist/index.css';

const currentUser = {
    userID: 1,
    username: "user1",
    password: "Pass1",
    favListIsPrivate: true
};

function ParkDetails({ park }) {
    const [amenities, setAmenities] = useState([]);
    const [isFavorite, setIsFavorite] = useState(null);


    const checkFavorites = async (parkCode) => {
        console.log('Park', parkCode); // Make sure this logs correctly. You might want to just use `parkCode` if `parkCode` is the actual variable you need.

        const url = `/getIfFavorite?userID=${currentUser.userID}&parkCode=${parkCode}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                setIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const loadAmenities = async () => {
        const API_KEY = "AbsNMYjgoFTxspUU7emrVh0CurAHh4I8MrBMSHmC";
        const NPS_Amenities_URL = `https://developer.nps.gov/api/v1/amenities/parksplaces?parkCode=${park.parkCode}&api_key=${API_KEY}`;

        try {
            const response = await fetch(NPS_Amenities_URL);
            const data = await response.json();
            if (data && data.data && Array.isArray(data.data)) {
                setAmenities(data.data.flat());
            }
        } catch (error) {
            console.error("Failed to load amenities:", error);
            setAmenities([]);  // Reset amenities on error
        }
    };

    useEffect(() => {
        loadAmenities();
        checkFavorites(park.parkCode);
    }, [park.parkCode]); // Depend on parkCode to reload amenities when it changes

    return (
        <div>
            {isFavorite !== null && (
                <p style={{ color: isFavorite ? 'green' : 'red' }}>
                    {isFavorite ? "This park is in your favorites!" : "This park is not in your favorites."}
                </p>
            )}
            <h1>{park.fullName}</h1>
            {park.images.length > 0 && (
                <img src={park.images[0].url} alt={park.images[0].altText} style={{maxWidth: '100%'}}/>
            )}
            <p>
                <strong>Location:</strong> {park.addresses[0].city}, {park.addresses[0].stateCode}, {park.addresses[0].countryCode}
            </p>
            <p><a href={park.url} target="_blank" rel="noopener noreferrer">Visit Park Website</a></p>
            <p><strong>Entry Fee:</strong> </p>
            <p><strong>Description:</strong> {park.description}</p>
            <p><strong>Activities:</strong> {park.activities.map(activity => activity.name).join(', ')}</p>
            <p>
                <strong>Amenities: </strong>{amenities.length > 0 ? amenities.map(amenity => amenity.name).join(', ') : 'No amenities available'}
            </p>
        </div>
    );
}

export default ParkDetails;