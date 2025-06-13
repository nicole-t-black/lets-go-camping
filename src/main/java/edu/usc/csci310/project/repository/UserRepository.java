package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {

    User findByUsernameAndPassword(String username, String password);

    User findByUsername(String username);

    User findByUserID(Long userID);
}