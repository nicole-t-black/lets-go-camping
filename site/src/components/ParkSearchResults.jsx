/*
Info shown on briefing (in search):
Have:
   Name - [Need to Center the Name]
   State - [Need to align this under the name]
   Activity - [Need to make this clickable, so it triggers a new search]
   Amenities provided - [Need to call this in an interesting way], [Need to make this clickable so it triggers a new search]
   Activity
   Location - [Need to make this clickable, so it triggers a new search]
   Amenity clicked will trigger/route to a new search with that term
 */
import "../styles/ParkSearchResults.css";
import Popup from 'reactjs-popup';
import ParkDetails from "./ParkDetails";


function ParkSearchResults({ park, suggest }) {

    return (
        <div>
            {!suggest &&
                <div className="individual-park-container">
                    <Popup trigger={<h1 role="button" tabIndex="0"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                document.activeElement.click();
                                // Code to trigger the popup
                            }
                        }} style={{cursor: 'pointer', textAlign: 'left',  whiteSpace: 'normal',  maxWidth: '350px'}}>{park.fullName}</h1>}>
                        <div>
                            <ParkDetails park={park} />
                        </div>
                    </Popup>
                    <p className="park-image">
                        {/* Safely access park.images */}
                        {Array.isArray(park.images) && park.images.length > 0 && (
                            <img src={park.images?.[0]?.url} alt={park.images?.[0]?.altText || 'Park image'}
                                 style={{maxWidth: '100%'}}/>
                        )}
                    </p>
                </div>}
            {suggest &&
                <Popup trigger={
                    <div className="individual-park-container"
                         role="button" tabIndex="0"
                         onKeyDown={e => {
                             if (e.key === 'Enter') {
                                 e.preventDefault();
                                 document.activeElement.click();
                                 // Code to trigger the popup
                             }
                         }}
                    >
                        <h1 style={{ cursor: 'pointer' }}>{park.fullName}</h1>
                        <p className="park-image">
                            {/* Safely access park.images */}
                            {Array.isArray(park.images) && park.images.length > 0 && (
                                <img src={park.images?.[0]?.url} alt={park.images?.[0]?.altText || 'Park image'}
                                     style={{maxWidth: '100%'}}/>
                            )}
                            {Array.isArray(park.images) && park.images.length > 0 && (
                                <img src={park.images?.[1]?.url} alt={park.images?.[1]?.altText || 'Park image'}
                                     style={{maxWidth: '100%'}}/>
                            )}
                            {Array.isArray(park.images) && park.images.length > 0 && (
                                <img src={park.images?.[2]?.url} alt={park.images?.[2]?.altText || 'Park image'}
                                     style={{maxWidth: '100%'}}/>
                            )}
                        </p>
                    </div>
                } position="center">
                    <div>
                        <ParkDetails park={park} />
                    </div>
                </Popup>}
        </div>
    );
}

export default ParkSearchResults;
