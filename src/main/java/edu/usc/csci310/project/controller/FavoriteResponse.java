package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.Favorite;
import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

@Setter
@Getter
public class FavoriteResponse {
    private String data;

    private ArrayList<User> users;

    private ArrayList<Park> favorites;

    private Boolean isFavorite;

    private Favorite newFavorite;

    private Boolean favListIsPrivate;

    private LinkedHashMap<String, Integer> results;

    private Map<String, ArrayList<String>> parkUsers;

    private ArrayList<String> suggest;
}