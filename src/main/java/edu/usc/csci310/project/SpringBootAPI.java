package edu.usc.csci310.project;

import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.repository.FavoriteRepository;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@SpringBootApplication
public class SpringBootAPI {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootAPI.class, args);
    }

    @RequestMapping(value = "{_:^(?!index\\.html|api).*$}")
    public String redirect() {
        // Forward to home page so that route is preserved.(i.e forward:/index.html)
        return "forward:/";
    }

    @Bean
    CommandLineRunner runner(UserRepository userRepository, ParkRepository parkRepository, FavoriteRepository favoriteRepository) {
        return args -> {
            User user0 = new User("user0test", "Password1");
            User user1 = new User("user1test", "Password1");
            // User user2 = new User("user2", "Password1");
            User user3 = new User("user3test", "Password1");
            User user4 = new User("user4test", "Password1");
            User user5 = new User("user5test", "Password1");
            User user6 = new User("user6test", "Password1");
            User user7 = new User("user7test", "Password1");

            user0.setFavListIsPrivate(false);
            user1.setFavListIsPrivate(false);
            // user2.setFavListIsPrivate(false);
            // user3.setFavListIsPrivate(false);
            user4.setFavListIsPrivate(false);
            user5.setFavListIsPrivate(false);
            user6.setFavListIsPrivate(false);
            user7.setFavListIsPrivate(false);

            userRepository.save(user0);
            userRepository.save(user1);
            // userRepository.save(user2);
            userRepository.save(user3);
            userRepository.save(user4);
            userRepository.save(user5);
            userRepository.save(user6);
            userRepository.save(user7);

            Park yosemite = new Park("Yosemite National Park", "yose");
            Park zion = new Park("Zion National Park", "zion");
            Park joshuaTree = new Park("Joshua Tree National Park", "jotr");
            Park deathValley = new Park("Death Valley National Park", "deva");

            parkRepository.save(yosemite);
            parkRepository.save(zion);
            parkRepository.save(joshuaTree);
            parkRepository.save(deathValley);

            Favorite user0yose = new Favorite(user0, yosemite, 1);
            Favorite user0zion = new Favorite(user0, zion, 2);
            Favorite user1yose = new Favorite(user1, yosemite, 1);
            Favorite user1zion = new Favorite(user1, zion, 2);
            Favorite user4josh = new Favorite(user4, joshuaTree, 1);
            Favorite user5yose = new Favorite(user5, yosemite, 1);
            Favorite user6zion = new Favorite(user6, zion, 1);
            Favorite user6yose = new Favorite(user6, yosemite, 2);
            Favorite user7deat = new Favorite(user7, deathValley, 1);
            Favorite user7zion = new Favorite(user7, zion, 2);

           favoriteRepository.save(user0yose);
           favoriteRepository.save(user0zion);
           favoriteRepository.save(user1yose);
           favoriteRepository.save(user1zion);
           favoriteRepository.save(user4josh);
           favoriteRepository.save(user5yose);
           favoriteRepository.save(user6zion);
           favoriteRepository.save(user6yose);
           favoriteRepository.save(user7deat);
           favoriteRepository.save(user7zion);

        };
    }
}
