package edu.usc.csci310.project;

import edu.usc.csci310.project.controller.CompareSuggestController;
import edu.usc.csci310.project.controller.FavoriteResponse;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.FavoriteService;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CompareSuggestControllerTest {

    @InjectMocks
    private static CompareSuggestController compareSuggestController;

    private static FavoriteService favoriteService;
    private static ParkRepository parkRepository;

    private static UserRepository userRepository;

    @BeforeEach
    public void setUp() throws Exception {
        favoriteService = mock();
        parkRepository = mock();
        userRepository = mock();
        compareSuggestController = new CompareSuggestController(favoriteService, parkRepository,userRepository);
    }

    @Test
    void testComparison() {
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
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getCompareResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("Compare results successful.", favoriteResponse.getData());
        assertEquals("par2", favoriteResponse.getResults().keySet().iterator().next());
    }

    @Test
    void testNoSuggestions() {
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
        user2Favorites.add(park3);

        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(user1Favorites);
        when(favoriteService.findParksByUserUserID(user2.getUserID())).thenReturn(user2Favorites);
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getSuggestResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("No Suggestions Found.", favoriteResponse.getData());
    }

    @Test
    void testOneSuggestion() {
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
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getSuggestResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("100.0% match.", favoriteResponse.getData());
        assertEquals("par2", favoriteResponse.getSuggest().get(0));
    }

    @Test
    void testOneSuggestionByRank() {
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
        user1Favorites.add(park1);
        user1Favorites.add(park2);
        user2Favorites.add(park1);
        user2Favorites.add(park2);

        ArrayList<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);


        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(user1Favorites);
        when(favoriteService.findParksByUserUserID(user2.getUserID())).thenReturn(user2Favorites);
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);
        when(parkRepository.findByParkCode("par1")).thenReturn(park1);
        when(favoriteService.sumRankingForParkByUsers(park1, users)).thenReturn(2);
        when(parkRepository.findByParkCode("par2")).thenReturn(park2);
        when(favoriteService.sumRankingForParkByUsers(park2, users)).thenReturn(4);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getSuggestResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("100.0% match.", favoriteResponse.getData());
        assertEquals(1, favoriteResponse.getSuggest().size());
        assertEquals("par1", favoriteResponse.getSuggest().get(0));
    }

    @Test
    void testTwoSuggestionsByRank() {
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
        user1Favorites.add(park1);
        user1Favorites.add(park2);
        user2Favorites.add(park1);
        user2Favorites.add(park2);

        ArrayList<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(user1Favorites);
        when(favoriteService.findParksByUserUserID(user2.getUserID())).thenReturn(user2Favorites);
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);
        when(parkRepository.findByParkCode("par1")).thenReturn(park1);
        when(favoriteService.sumRankingForParkByUsers(park1, users)).thenReturn(3);
        when(parkRepository.findByParkCode("par2")).thenReturn(park2);
        when(favoriteService.sumRankingForParkByUsers(park2, users)).thenReturn(3);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getSuggestResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("100.0% match.", favoriteResponse.getData());
        assertEquals(2, favoriteResponse.getSuggest().size());
        assertEquals("par1", favoriteResponse.getSuggest().get(0));
        assertEquals("par2", favoriteResponse.getSuggest().get(1));
    }

    @Test
    void testReplaceSuggestions() {
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
        user1Favorites.add(park2);
        user1Favorites.add(park1);
        user2Favorites.add(park2);
        user2Favorites.add(park1);

        ArrayList<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);


        when(favoriteService.findParksByUserUserID(user1.getUserID())).thenReturn(user1Favorites);
        when(favoriteService.findParksByUserUserID(user2.getUserID())).thenReturn(user2Favorites);
        when(userRepository.findByUserID(1L)).thenReturn(user1);
        when(userRepository.findByUserID(2L)).thenReturn(user2);
        when(parkRepository.findByParkCode("par1")).thenReturn(park1);
        when(favoriteService.sumRankingForParkByUsers(park1, users)).thenReturn(4);
        when(parkRepository.findByParkCode("par2")).thenReturn(park2);
        when(favoriteService.sumRankingForParkByUsers(park2, users)).thenReturn(2);

        ResponseEntity<FavoriteResponse> response = compareSuggestController.getSuggestResults(userIDsToCompare);
        FavoriteResponse favoriteResponse = response.getBody();
        assert favoriteResponse != null;
        assertEquals("100.0% match.", favoriteResponse.getData());
        assertEquals(1, favoriteResponse.getSuggest().size());
        assertEquals("par2", favoriteResponse.getSuggest().get(0));
    }

    @Test
    void gettersAndSettersAndConstructors() {
        FavoriteResponse favoriteResponse = new FavoriteResponse();

        //test Results getter and setter
        LinkedHashMap<String, Integer> testResults = new LinkedHashMap<>();
        testResults.put("par1", 1);
        testResults.put("par2", 2);
        favoriteResponse.setResults(testResults);
        testResults = favoriteResponse.getResults();

        assertEquals(testResults.size(),2);
        assertEquals(testResults.get("par1"), 1);
        assertEquals(testResults.get("par2"), 2);

        //test parkUsers getter and setter
        Map<String, ArrayList<String>> testParkUsers = new HashMap<>();
        ArrayList<String> users = new ArrayList<>();
        users.add("user1");
        users.add("user2");
        testParkUsers.put("par1", users);
        testParkUsers.put("par2", users);
        favoriteResponse.setParkUsers(testParkUsers);
        testParkUsers = favoriteResponse.getParkUsers();

        assertEquals(testParkUsers.size(),2);
        assertEquals(testParkUsers.get("par1").get(0), "user1");
        assertEquals(testParkUsers.get("par1").get(1), "user2");
        assertEquals(testParkUsers.get("par2").get(0), "user1");
        assertEquals(testParkUsers.get("par2").get(1), "user2");

        //test suggest getter and setter
        ArrayList<String> testSuggest = new ArrayList<>();
        testSuggest.add("user1");
        testSuggest.add("user2");
        testSuggest.add("user3");
        favoriteResponse.setSuggest(testSuggest);
        testSuggest = favoriteResponse.getSuggest();

        assertEquals(testSuggest.size(),3);
        assertEquals(testSuggest.get(0), "user1");
        assertEquals(testSuggest.get(1), "user2");
        assertEquals(testSuggest.get(2), "user3");
    }
}
