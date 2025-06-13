package edu.usc.csci310.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Favorites")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favID;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "parkID")
    private Park park;

    private int rank;

    public Favorite(User user, Park park, int rank) {
        this.user = user;
        this.park = park;
        this.rank = rank;
    }
}