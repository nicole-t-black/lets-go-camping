package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.User;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.repository.FavoriteRepository;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import edu.usc.csci310.project.repository.FavoriteService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.util.*;

@RestController
@AllArgsConstructor
@Slf4j
public class FavoritesController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParkRepository parkRepository;

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/addFavorite")
    public ResponseEntity<FavoriteResponse> addFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());

        Integer rank = favoriteRepository.countByUserUserID(user.getUserID());

        Park existingPark = parkRepository.findByParkCode(favoriteRequest.getParkCode());

        Favorite newFavorite;

        if (existingPark == null) {
            Park park = new Park(favoriteRequest.getParkName(), favoriteRequest.getParkCode());
            parkRepository.save(park);
            newFavorite = new Favorite(user, park, rank + 1);
        }
        else {
            if (favoriteRepository.findByUserUserIDAndParkParkID(user.getUserID(), parkRepository.findByParkCode(favoriteRequest.getParkCode()).getParkID()) != null) {
                response.setData("User already has park as favorite.");
                return ResponseEntity.badRequest().body(response);
            }
            newFavorite = new Favorite(user, existingPark, rank + 1);
        }

        favoriteRepository.save(newFavorite);
        response.setNewFavorite(newFavorite);
        response.setData("Favorite successfully added.");
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/removeFavorite")
    public ResponseEntity<FavoriteResponse> removeFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());
        Park park = parkRepository.findByParkCode(favoriteRequest.getParkCode());

        Favorite removedFavorite = favoriteRepository.findByUserUserIDAndParkParkID(user.getUserID(), parkRepository.findByParkCode(park.getParkCode()).getParkID());
        if (removedFavorite == null) {
            response.setData("Favorite does not exist.");
            return ResponseEntity.badRequest().body(response);
        }

        ArrayList<Favorite> lowerFavorites = favoriteRepository.findByUserUserIDAndRankGreaterThan(user.getUserID(), removedFavorite.getRank());

        for (Favorite favorite : lowerFavorites) {
            favorite.setRank(favorite.getRank() - 1);
            favoriteRepository.save(favorite);
        }

        ArrayList<Favorite> emptyList = new ArrayList<>();

        favoriteRepository.delete(removedFavorite);
        response.setData("Remove favorite successful.");
        if (Objects.equals(favoriteRepository.findByParkParkCode(park.getParkCode()), emptyList)) {
            parkRepository.delete(park);
        }
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getIfFavorite")
    public ResponseEntity<FavoriteResponse> getIfFavorite(@RequestParam Long userID, @RequestParam String parkCode) {
        FavoriteResponse response = new FavoriteResponse();

        response.setIsFavorite(favoriteService.findIfUserAndParkFav(userID, parkCode));

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getFavorites")
    public ResponseEntity<FavoriteResponse> getFavorites(@RequestParam Long userID) {
        FavoriteResponse response = new FavoriteResponse();

        ArrayList<Park> favorites = favoriteService.findParksByUserUserID(userID);
        response.setFavorites(favorites);

        if(response.getFavorites().isEmpty()) {
            response.setData("No favorites. Add parks from the search page.");
        }
        else {
            response.setData("Successfully fetched favorites.");
        }
        return ResponseEntity.ok().body(response);
    }


    @PostMapping("/moveParkUp")
    public ResponseEntity<FavoriteResponse> moveParkUp(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());
        Park park = parkRepository.findByParkCode(favoriteRequest.getParkCode());

        Favorite parkToMove = favoriteRepository.findByUserUserIDAndParkParkID(user.getUserID(), park.getParkID());

        if (parkToMove == null) {
            response.setData("Favorite not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if (parkToMove.getRank() > 1) {
            Favorite parkAbove = favoriteRepository.findByUserUserIDAndRank(user.getUserID(), parkToMove.getRank() - 1);

            int tempRank = parkAbove.getRank();
            parkAbove.setRank(parkToMove.getRank());
            parkToMove.setRank(tempRank);

            favoriteRepository.save(parkAbove);
            favoriteRepository.save(parkToMove);

            response.setData("Move park up successful.");
            return ResponseEntity.ok().body(response);
        }

        response.setData("Park is already at the top.");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/moveParkDown")
    public ResponseEntity<FavoriteResponse> moveParkDown(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());
        Park park = parkRepository.findByParkCode(favoriteRequest.getParkCode());

        response.setData("Move park down successful.");

        Favorite parkToMove = favoriteRepository.findByUserUserIDAndParkParkID(user.getUserID(), park.getParkID());

        if (parkToMove == null) {
            response.setData("Favorite not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if (parkToMove.getRank() < favoriteRepository.countByUserUserID(user.getUserID())) {
            Favorite parkBelow = favoriteRepository.findByUserUserIDAndRank(user.getUserID(), parkToMove.getRank() + 1);

            int tempRank = parkBelow.getRank();
            parkBelow.setRank(parkToMove.getRank());
            parkToMove.setRank(tempRank);

            favoriteRepository.save(parkBelow);
            favoriteRepository.save(parkToMove);

            response.setData("Move park down successful.");
            return ResponseEntity.ok().body(response);
        }

        response.setData("Park is already at the bottom.");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/clearFavorites")
    public ResponseEntity<FavoriteResponse> clearFavorites(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());
        ArrayList<Favorite> favorites = favoriteRepository.findByUserUserID(user.getUserID());
        ArrayList<Favorite> emptyList = new ArrayList<>();
        for (Favorite favorite : favorites) {
            favoriteRepository.delete(favorite);
            if (Objects.equals(favoriteRepository.findByParkParkCode(favorite.getPark().getParkCode()), emptyList)) {
                parkRepository.delete(favorite.getPark());
            }
        }

        response.setData("Clear favorites successful.");

        favoriteRepository.deleteFavoriteByUserUserID(user.getUserID());

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/toggleVisibility")
    public ResponseEntity<FavoriteResponse> toggleVisibility(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(favoriteRequest.getUserID());

        user.setFavListIsPrivate(!user.getFavListIsPrivate());

        userRepository.save(user);

        response.setFavListIsPrivate(user.getFavListIsPrivate());

        response.setData("Favorites visibility toggled.");

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getVisibility")
    public ResponseEntity<FavoriteResponse> getVisibility(@RequestParam Long userID) {
        FavoriteResponse response = new FavoriteResponse();

        User user = userRepository.findByUserID(userID);

        response.setFavListIsPrivate(user.getFavListIsPrivate());
        response.setData("Successfully fetched visibility.");

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getCompareResults")
    public ResponseEntity<FavoriteResponse> getCompareResults(@RequestParam ArrayList<Long> userIDsToCompare) {
        FavoriteResponse response = new FavoriteResponse();

        Map<Park, Integer> parkCounts = new HashMap<>();

        for (Long userID : userIDsToCompare) {
            ArrayList<Park> userFavoriteParks = favoriteService.findParksByUserUserID(userID);
            for (Park park : userFavoriteParks) {
                parkCounts.put(park, parkCounts.getOrDefault(park, 0) + 1);
            }
        }

        ArrayList<Park> sortedParks = new ArrayList<>(parkCounts.keySet());
        sortedParks.sort((park1, park2) -> parkCounts.get(park2) - parkCounts.get(park1));

        System.out.println("Sorted parks: " + sortedParks.get(0).getParkName() + sortedParks.get(1).getParkName());

        response.setData("Compare results successful.");
        response.setFavorites(sortedParks);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getUsersWhoFavorited")
    public ResponseEntity<FavoriteResponse> getUsersWhoFavorited(@RequestParam ArrayList<Long> usersToCompare, @RequestParam Long parkID) {
        FavoriteResponse response = new FavoriteResponse();

        ArrayList<User> usersWhoFavoritedPark = new ArrayList<>();

        for (Long userID : usersToCompare) {
            if (favoriteRepository.findByUserUserIDAndParkParkID(userID, parkID) != null) {
                usersWhoFavoritedPark.add(userRepository.findByUserID(userID));
            }
        }

        response.setUsers(usersWhoFavoritedPark);
        response.setData("Users who favorited the park retrieved successfully.");

        return ResponseEntity.ok().body(response);
    }

}