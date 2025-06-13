package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.model.Park;
import org.springframework.data.repository.CrudRepository;

public interface ParkRepository extends CrudRepository<Park, Integer> {

    Park findByParkCode(String parkCode);
}
