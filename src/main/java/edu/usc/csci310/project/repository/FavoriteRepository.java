package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.model.Favorite;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;

public interface FavoriteRepository extends CrudRepository<Favorite, Integer> {

    void deleteByUserUserID(Long userID);
    Favorite findByUserUserIDAndRank(Long userID, Integer rank);

    ArrayList<Favorite> findByUserUserIDAndRankGreaterThan(Long userID, Integer rank);

    Favorite findByUserUserIDAndParkParkID(Long userID, Long parkID);

    Integer countByUserUserID(Long userID);

    ArrayList<Favorite> findByUserUserID(Long userID);

    ArrayList<Favorite> findByUserUserIDOrderByRankAsc(Long userID);

    ArrayList<Favorite> findByParkParkCode(String parkCode);

    void deleteFavoriteByUserUserID(Long userID);
}