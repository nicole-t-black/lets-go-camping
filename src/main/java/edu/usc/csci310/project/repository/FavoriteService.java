package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;

import java.util.ArrayList;

public interface FavoriteService {
    Boolean findIfUserAndParkFav(Long userID, String parkCode);
    ArrayList<Park> findParksByUserUserID(Long userID);
    Integer sumRankingForParkByUsers(Park park, ArrayList<User> users);
}