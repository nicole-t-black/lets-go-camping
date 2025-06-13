package edu.usc.csci310.project;

import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class FavoriteServiceImplTest {

    private static FavoriteRepository favoriteRepository;
    private static FavoriteService favoriteService;
    private static FavoriteServiceImpl favoritesServiceImpl;

    @BeforeEach
    public void setUp() throws Exception {
        favoriteRepository = mock();
        favoriteService = mock();
        favoritesServiceImpl = new FavoriteServiceImpl(favoriteRepository);
    }

    @Test
    void testFindIfUserAndParkFav() {
        ArrayList<Park> parkList = new ArrayList<>();
        Park park = new Park("park1", "par");
        park.setParkID(1L);
        parkList.add(park);

        ArrayList<Favorite> favorites = new ArrayList<>();
        User user = new User("username", "password");
        user.setUserID(1L);
        Favorite favorite = new Favorite(user, park, 1);
        favorites.add(favorite);

        when(favoriteRepository.findByUserUserIDOrderByRankAsc(1L)).thenReturn(favorites);
        assertEquals(true, favoritesServiceImpl.findIfUserAndParkFav(1L, park.getParkCode()));

        assertEquals(false, favoritesServiceImpl.findIfUserAndParkFav(1L, "notACode"));
    }

    @Test
    void testFindParksByUserUserID() {
        ArrayList<Favorite> favorites = new ArrayList<>();
        User user = new User("username", "password");
        user.setUserID(1L);
        Park park = new Park("park1", "par");
        Favorite favorite1 = new Favorite(user, park, 1);
        favorites.add(favorite1);

        when(favoriteRepository.findByUserUserIDOrderByRankAsc(1L)).thenReturn(favorites);
        assertEquals(park.getParkName(), favoritesServiceImpl.findParksByUserUserID(1L).get(0).getParkName());
    }

    @Test
    void testSumRankingForParkByUsers() {
        ArrayList<User> users = new ArrayList<>();
        User user1 = new User("user1", "testPassword");
        User user2 = new User("user2", "testPassword2");
        user1.setUserID(1L);
        user2.setUserID(2L);
        users.add(user1);
        users.add(user2);

        Park park = new Park("park1", "par1");

        Favorite favorite1 = mock(Favorite.class);
        Favorite favorite2 = mock(Favorite.class);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user1.getUserID(), park.getParkID())).thenReturn(favorite1);
        when(favoriteRepository.findByUserUserIDAndParkParkID(user2.getUserID(), park.getParkID())).thenReturn(favorite2);

        when(favorite1.getRank()).thenReturn(1);
        when(favorite2.getRank()).thenReturn(2);

        assertEquals(favoritesServiceImpl.sumRankingForParkByUsers(park, users), 3);
    }
}