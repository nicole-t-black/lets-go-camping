package edu.usc.csci310.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Parks")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class Park {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long parkID;

    private String parkName;
    private String parkCode; // we will need to run an API query each time to fetch other info

    public Park(String parkName, String parkCode) {
        this.parkName = parkName;
        this.parkCode = parkCode;
    }
}