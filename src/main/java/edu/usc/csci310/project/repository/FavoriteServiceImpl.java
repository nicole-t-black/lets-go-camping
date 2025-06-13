package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public Boolean findIfUserAndParkFav(Long userID, String parkCode) {
        ArrayList<Park> parkList = findParksByUserUserID(userID);
        ArrayList<String> parkIDList = new ArrayList<>();
        for (Park park : parkList) {
            parkIDList.add(park.getParkCode());
        }
        return parkIDList.contains(parkCode);
    }

    @Override
    public ArrayList<Park> findParksByUserUserID(Long userID) {
        ArrayList<Favorite> favorites = favoriteRepository.findByUserUserIDOrderByRankAsc(userID);
        ArrayList<Park> favoriteParks = new ArrayList<>();
        for (Favorite favorite : favorites) {
            favoriteParks.add(favorite.getPark());
        }
        return favoriteParks;
    }

    @Override
    public Integer sumRankingForParkByUsers(Park park, ArrayList<User> users) {
        int sum = 0;
        for (User user : users) {
            sum += favoriteRepository.findByUserUserIDAndParkParkID(user.getUserID(), park.getParkID()).getRank();
        }
        return sum;
    }


}