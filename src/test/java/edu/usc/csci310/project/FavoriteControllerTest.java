package edu.usc.csci310.project;

import edu.usc.csci310.project.controller.*;
import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.FavoriteRepository;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import edu.usc.csci310.project.repository.FavoriteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Array;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class FavoriteControllerTest {

    private static FavoriteRepository favoriteRepository;
    private static UserRepository userRepository;
    private static ParkRepository parkRepository;
    private static FavoritesController favoritesController;
    private static FavoriteService favoriteService;

    @BeforeEach
    public void setUp() throws Exception {
        favoriteRepository = mock();
        userRepository = mock();
        parkRepository = mock();
        favoriteService = mock();
        favoritesController = new FavoritesController(favoriteRepository, userRepository, parkRepository, favoriteService);
    }

    @Test
    void testAddExistingFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);
        Park park = new Park(1L, "park1", "par");
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        when(favoriteRepository.countByUserUserID(1L)).thenReturn(3); // mock that there are three existing favorites for user 1
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.addFavorite(favoriteRequest);

        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        Favorite assertFavorite = new Favorite(user1, park, 4);
        assertEquals(assertFavorite.getUser(), favoriteResponse.getNewFavorite().getUser());
        assertEquals(assertFavorite.getPark(), favoriteResponse.getNewFavorite().getPark());
        assertEquals(assertFavorite.getRank(), favoriteResponse.getNewFavorite().getRank());
        assertEquals("Favorite successfully added.", favoriteResponse.getData());
    }

    @Test
    void testAddNewFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        when(favoriteRepository.countByUserUserID(user1.getUserID())).thenReturn(3);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(null).thenReturn(park);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.addFavorite(favoriteRequest);

        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        Favorite assertFavorite = new Favorite(user1, park, 4);
        assertEquals(assertFavorite.getUser(), favoriteResponse.getNewFavorite().getUser());
        assertEquals(assertFavorite.getPark().getParkCode(), favoriteResponse.getNewFavorite().getPark().getParkCode());
        assertEquals(assertFavorite.getRank(), favoriteResponse.getNewFavorite().getRank());
        assertEquals("Favorite successfully added.", favoriteResponse.getData());
    }

    @Test
    void testFailAddFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        Favorite favorite = new Favorite(user1, park, 4);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        when(favoriteRepository.countByUserUserID(user1.getUserID())).thenReturn(3); // mock that there are three existing favorites for user 1
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), parkRepository.findByParkCode(park.getParkCode()).getParkID())).thenReturn(favorite);

        ResponseEntity<FavoriteResponse> response = favoritesController.addFavorite(favoriteRequest);

        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("User already has park as favorite.", favoriteResponse.getData());
    }

    @Test
    void testSuccessfulRemoveFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);
        User user2 = new User("username", "password");
        user2.setUserID(2L);
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        Favorite favorite = new Favorite(user1, park, 1);
        Favorite favorite2 = new Favorite(user1, new Park("park2", "par2"), 2);
        Favorite favorite3 = new Favorite(user2, park, 1);
        ArrayList<Favorite> lowerFavorites = new ArrayList<>();
        lowerFavorites.add(favorite2);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), parkRepository.findByParkCode(park.getParkCode()).getParkID())).thenReturn(favorite);
        when(favoriteRepository.findByUserUserIDAndRankGreaterThan(user1.getUserID(), favorite.getRank())).thenReturn(lowerFavorites);

        ResponseEntity<FavoriteResponse> response = favoritesController.removeFavorite(favoriteRequest);

        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals(1, favorite2.getRank());
        assertEquals("Remove favorite successful.", favoriteResponse.getData());

        FavoriteRequest favoriteRequest2 = new FavoriteRequest();
        favoriteRequest2.setUserID(user2.getUserID());
        favoriteRequest2.setParkCode(park.getParkCode());
        ArrayList<Favorite> emptyList = new ArrayList<>();
        ArrayList<Favorite> favList = new ArrayList<>();
        favList.add(favorite3);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);
        when(userRepository.findByUserID(user2.getUserID())).thenReturn(user2);
        when(favoriteRepository.findByParkParkCode(park.getParkCode())).thenReturn(favList).thenReturn(emptyList);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user2.getUserID(), parkRepository.findByParkCode(park.getParkCode()).getParkID())).thenReturn(favorite3);
        when(favoriteRepository.findByUserUserIDAndRankGreaterThan(user2.getUserID(), favorite.getRank())).thenReturn(emptyList);

        ResponseEntity<FavoriteResponse> response2 = favoritesController.removeFavorite(favoriteRequest2);

        FavoriteResponse favoriteResponse2 = response2.getBody();
        assert favoriteResponse2 != null;
        assertEquals("Remove favorite successful.", favoriteResponse.getData());
    }

    @Test
    void testFailRemoveFavorite() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User();
        user1.setUsername("test");
        user1.setPassword("ps");
        user1.setUserID(1L);
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setParkCode(park.getParkCode());
        favoriteRequest.setUserID(user1.getUserID());
        Favorite favorite2 = new Favorite(user1, new Park("park2", "par2"), 2);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(null);
        System.out.println("HERE3");
        ResponseEntity<FavoriteResponse> response = favoritesController.removeFavorite(favoriteRequest);

        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals(2, favorite2.getRank());
        assertEquals("Favorite does not exist.", favoriteResponse.getData());
    }

    @Test
    void testGetIfFavorites() {
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        when(favoriteService.findIfUserAndParkFav(user1.getUserID(), park.getParkCode())).thenReturn(true).thenReturn(false);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.getIfFavorite(user1.getUserID(), park.getParkCode());
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals(true, favoriteResponse.getIsFavorite());

        ResponseEntity<FavoriteResponse> response2 = favoritesController.getIfFavorite(user1.getUserID(), park.getParkCode());
        FavoriteResponse favoriteResponse2 = response2.getBody();
        assert favoriteResponse2 != null;
        assertEquals(false, favoriteResponse2.getIsFavorite());
    }

    @Test
    void testGetFavorites() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        ArrayList<Park> favoriteParksListEmpty = new ArrayList<>();
        ArrayList<Park> favoriteParksList = new ArrayList<>();
        favoriteParksList.add(new Park("park1", "par"));
        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(favoriteParksListEmpty).thenReturn(favoriteParksList);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.getFavorites(user1.getUserID());
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("No favorites. Add parks from the search page.", favoriteResponse.getData());

        ResponseEntity<FavoriteResponse> response2 = favoritesController.getFavorites(user1.getUserID());
        FavoriteResponse favoriteResponse2 = response2.getBody();
        assert favoriteResponse2 != null;
        assertEquals("Successfully fetched favorites.", favoriteResponse2.getData());
    }

    @Test
    void testMoveParkUp1() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(null);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkUp(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Favorite not found.", favoriteResponse.getData());
    }

    @Test
    void testMoveParkUp2() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        Favorite parkToMove = new Favorite(user1, park, 2);
        Favorite parkAbove = new Favorite(user1, new Park("park2", "par2"), 1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(parkToMove);
        when(favoriteRepository.findByUserUserIDAndRank(user1.getUserID(), parkToMove.getRank() - 1)).thenReturn(parkAbove);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkUp(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Move park up successful.", favoriteResponse.getData());
        assertEquals(1, parkToMove.getRank());
        assertEquals(2, parkAbove.getRank());
    }

    @Test
    void testMoveParkUp3() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        Favorite parkToMove = new Favorite(user1, park, 1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(parkToMove);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkUp(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Park is already at the top.", favoriteResponse.getData());
        assertEquals(1, parkToMove.getRank());
    }

    @Test
    void testMoveParkDown1() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(null);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkDown(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Favorite not found.", favoriteResponse.getData());
    }

    @Test
    void testMoveParkDown2() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        Favorite parkToMove = new Favorite(user1, park, 1);
        Favorite parkBelow = new Favorite(user1, new Park("park2", "par2"), 2);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(parkToMove);
        when(favoriteRepository.findByUserUserIDAndRank(user1.getUserID(), parkToMove.getRank() + 1)).thenReturn(parkBelow);
        when(favoriteRepository.countByUserUserID(user1.getUserID())).thenReturn(2);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkDown(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Move park down successful.", favoriteResponse.getData());
        assertEquals(2, parkToMove.getRank());
        assertEquals(1, parkBelow.getRank());
    }

    @Test
    void testMoveParkDown3() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        favoriteRequest.setUserID(user1.getUserID());
        favoriteRequest.setParkCode(park.getParkCode());
        Favorite parkToMove = new Favorite(user1, park, 2);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(parkToMove);
        when(favoriteRepository.countByUserUserID(user1.getUserID())).thenReturn(2);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(park.getParkCode())).thenReturn(park);

        ResponseEntity<FavoriteResponse> response = favoritesController.moveParkDown(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Park is already at the bottom.", favoriteResponse.getData());
        assertEquals(2, parkToMove.getRank());
    }

    @Test
    void testClearFavorites() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        favoriteRequest.setUserID(user1.getUserID());

        ArrayList<Favorite> favList = new ArrayList<>();
        Favorite favorite1 = new Favorite(user1, new Park("park1", "par1"), 1);
        Favorite favorite2 = new Favorite(user1, new Park("park2", "par2"), 2);
        favList.add(favorite1);
        favList.add(favorite2);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(favoriteRepository.findByUserUserID(user1.getUserID())).thenReturn(favList);
        ArrayList<Favorite> emptyList = new ArrayList<>();
        ArrayList<Favorite> favList2 = new ArrayList<>();
        favList2.add(new Favorite(new User("user2", "pw1"), new Park("park2", "par2"), 1));
        when(favoriteRepository.findByParkParkCode(favorite1.getPark().getParkCode())).thenReturn(emptyList);
        when(favoriteRepository.findByParkParkCode(favorite2.getPark().getParkCode())).thenReturn(favList);

        ResponseEntity<FavoriteResponse> response = favoritesController.clearFavorites(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Clear favorites successful.", favoriteResponse.getData());
    }

    @Test
    void testToggleVisibility() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);        
        favoriteRequest.setUserID(user1.getUserID());

        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.toggleVisibility(favoriteRequest);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Favorites visibility toggled.", favoriteResponse.getData());
        assertEquals(false, user1.getFavListIsPrivate());

        ResponseEntity<FavoriteResponse> response2 = favoritesController.toggleVisibility(favoriteRequest);
        FavoriteResponse favoriteResponse2 = response2.getBody();
        assert favoriteResponse2 != null;
        assertEquals("Favorites visibility toggled.", favoriteResponse2.getData());
        assertEquals(true, user1.getFavListIsPrivate());
    }

    @Test
    void testGetVisibility() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        User user1 = new User("username", "password");
        user1.setUserID(1L);

        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);

        ResponseEntity<FavoriteResponse> response = favoritesController.getVisibility(user1.getUserID());
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Successfully fetched visibility.", favoriteResponse.getData());
        assertEquals(true, favoriteResponse.getFavListIsPrivate());

        user1.setFavListIsPrivate(!user1.getFavListIsPrivate());
        ResponseEntity<FavoriteResponse> response2 = favoritesController.getVisibility(user1.getUserID());
        FavoriteResponse favoriteResponse2 = response2.getBody();
        assert favoriteResponse2 != null;
        assertEquals("Successfully fetched visibility.", favoriteResponse2.getData());
        assertEquals(false, favoriteResponse2.getFavListIsPrivate());
    }

    @Test
    void testGetCompareResults() {
        User user1 = new User("username", "password");
        user1.setUserID(1L);
        User user2 = new User("username2", "password2");
        user2.setUserID(2L);
        ArrayList<Long> userIDsToCompare = new ArrayList<>();
        userIDsToCompare.add(user1.getUserID());
        userIDsToCompare.add(user2.getUserID());

        ArrayList<Park> user1Favorites = new ArrayList<>();
        ArrayList<Park> user2Favorites = new ArrayList<>();
        Park park1 = new Park("park1", "par1");
        Park park2 = new Park("park2", "par2");
        Park park3 = new Park("park3", "par3");
        user1Favorites.add(park1);
        user1Favorites.add(park2);
        user2Favorites.add(park2);
        user2Favorites.add(park3);

        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(user1Favorites);
        when(favoriteService.findParksByUserUserID(user2.getUserID())).thenReturn(user2Favorites);

        ResponseEntity<FavoriteResponse> response = favoritesController.getCompareResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Compare results successful.", favoriteResponse.getData());
        assertEquals("park2", favoriteResponse.getFavorites().get(0).getParkName());
    }

    @Test
    void testGetUsersWhoFavorited() {
        FavoriteRequest favoriteRequest = new FavoriteRequest();
        ArrayList<Long> userIDsToCompare = new ArrayList<>();
        User user1 = new User("user1", "testPassword");
        User user2 = new User("user2", "testPassword2");
        user1.setUserID(1L);
        user2.setUserID(2L);
        userIDsToCompare.add(user1.getUserID());
        userIDsToCompare.add(user2.getUserID());

        Park parkToCheck = new Park("park1", "par");
        parkToCheck.setParkID(1L);

        Favorite favorite = new Favorite(user1, parkToCheck, 1);

        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), parkToCheck.getParkID())).thenReturn(favorite);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user2.getUserID(), parkToCheck.getParkID())).thenReturn(null);
        when(userRepository.findByUserID(user1.getUserID())).thenReturn(user1);
        when(parkRepository.findByParkCode(parkToCheck.getParkCode())).thenReturn(parkToCheck);

        ResponseEntity<FavoriteResponse> response = favoritesController.getUsersWhoFavorited(userIDsToCompare, parkToCheck.getParkID());
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;

        assertEquals("Users who favorited the park retrieved successfully.", favoriteResponse.getData());
        //assertEquals("user1", favoriteResponse.getUsers().get(0).getUsername());
        assertEquals(1, favoriteResponse.getUsers().size());
    }

    @Test
    void gettersAndSettersAndConstructors() {
        String parkName = "validParkName";
        String parkCode = "validParkCode";
        Park park = new Park(1L, parkName, parkCode);
        assertEquals(park.getParkName(), parkName);
        assertEquals(park.getParkCode(), parkCode);

        Park park2 = new Park();
        park2.setParkName("otherParkName");
        park2.setParkCode("otherParkCode");
        park2.setParkID(2L);
        assertEquals(park2.getParkName(), "otherParkName");
        assertEquals(park2.getParkCode(), "otherParkCode");
        assertEquals(park2.getParkID(), 2L);

        Park park3 = new Park("thirdParkName", "thirdParkCode");
        park3.setParkID(3L);
        assertEquals(park3.getParkName(), "thirdParkName");
        assertEquals(park3.getParkCode(), "thirdParkCode");
        assertEquals(park3.getParkID(), 3L);


        String username = "validUsername";
        String password = "validPassword";
        User user1 = new User(1L, "validUsername", "validPassword", true);
        Favorite favorite = new Favorite(1L, user1, park,1 );
        assertEquals(favorite.getPark(), park);
        assertEquals(favorite.getUser(), user1);
        assertEquals(favorite.getFavID(), 1L);

        Favorite favorite2 = new Favorite();
        User user2 = new User(2L, "otherUsername", "otherPassword", true);
        favorite2.setUser(user2);
        favorite2.setPark(park2);
        favorite2.setFavID(2L);
        assertEquals(favorite2.getPark(), park2);
        assertEquals(favorite2.getUser(), user2);
        assertEquals(favorite2.getFavID(), 2L);

        User user3 = new User(3L, "thirdUsername", "thirdPassword", false);
        Favorite favorite3 = new Favorite(user3, park3, 2);
        favorite3.setFavID(3L);
        assertEquals(favorite3.getPark(), park3);
        assertEquals(favorite3.getUser(), user3);
        assertEquals(favorite3.getFavID(), 3L);

        FavoriteRequest favoriteRequest = new FavoriteRequest();
        favoriteRequest.setUserID(1L);
        favoriteRequest.setParkCode("code");
        favoriteRequest.setParkName("name");
        assertEquals(favoriteRequest.getParkName(), "name");
    }
}
