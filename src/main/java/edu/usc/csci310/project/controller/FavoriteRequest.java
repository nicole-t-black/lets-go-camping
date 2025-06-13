package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Setter
@Getter
public class FavoriteRequest {
    private Long userID;
    private String parkCode;
    private String parkName;
}
