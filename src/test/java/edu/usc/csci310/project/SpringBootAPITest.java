package edu.usc.csci310.project;

import edu.usc.csci310.project.repository.FavoriteRepository;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.Favorite;
import org.junit.jupiter.api.Test;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class SpringBootAPITest {

    @Test
    void redirectTest() {
        SpringBootAPI spa = new SpringBootAPI();
        assertEquals("forward:/", spa.redirect());
    }

    @Test
    void mainTest() {
        ConfigurableApplicationContext mockContext = mock(ConfigurableApplicationContext.class);
        mockStatic(SpringApplication.class);
        when(SpringApplication.run(SpringBootAPI.class, new String[]{})).thenReturn(mockContext);

        String[] args = {};
        SpringBootAPI.main(args);

        SpringApplication.run(SpringBootAPI.class, args);
    }

    @Test
    void runnerTest() throws Exception {
        UserRepository userRepository = mock();
        ParkRepository parkRepository = mock();
        FavoriteRepository favoriteRepository = mock();

        SpringBootAPI spa = new SpringBootAPI();
        CommandLineRunner runner = spa.runner(userRepository, parkRepository, favoriteRepository);

        User user = new User("test", "Password1");
        Park park = new Park("test", "test");
        Favorite favorite = new Favorite(user, park, 1);

        when(userRepository.save(any(User.class))).thenReturn(user);
        when(parkRepository.save(any(Park.class))).thenReturn(park);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(favorite);

        runner.run("");

        verify(userRepository, times(7)).save(any(User.class));
        verify(parkRepository, times(4)).save(any(Park.class));
        verify(favoriteRepository, times(10)).save(any(Favorite.class));
    }
}
