package edu.usc.csci310.project.controller;

import edu.usc.csci310.project.model.Park;
import edu.usc.csci310.project.model.User;

import edu.usc.csci310.project.repository.FavoriteService;
import edu.usc.csci310.project.repository.ParkRepository;
import edu.usc.csci310.project.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
public class CompareSuggestController {

    private FavoriteService favoriteService;
    @Autowired
    private ParkRepository parkRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/comparisons")
    public ResponseEntity<FavoriteResponse> getCompareResults(@RequestParam ArrayList<Long> allUserIds) {
        FavoriteResponse response = new FavoriteResponse();

        //map to keep track of parks and counts of appearances
        Map<String, Integer> parkCounts = new HashMap<>();
        // Map to keep track of usernames for each park
        Map<String, ArrayList<String>> parkUsers = new HashMap<>();

        for (Long userID : allUserIds) {
            ArrayList<Park> userFavoriteParks = favoriteService.findParksByUserUserID(userID);
            for (Park park : userFavoriteParks) {
                String parkCode = park.getParkCode();

                // Update park count
                parkCounts.put(parkCode, parkCounts.getOrDefault(parkCode, 0) + 1);

                // Get the username for the user ID
                String username = userRepository.findByUserID(userID).getUsername();

                // Update username list for each park
                parkUsers.computeIfAbsent(parkCode, k -> new ArrayList<>()).add(username);
            }
        }

        // Sort the park codes by the number of times they appear
        List<Map.Entry<String, Integer>> sortedEntries = new ArrayList<>(parkCounts.entrySet());
        sortedEntries.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        // Convert sortedEntries back to a LinkedHashMap to be returned to frontend
        LinkedHashMap<String, Integer> sortedParks = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : sortedEntries) {
            sortedParks.put(entry.getKey(), entry.getValue());
        }

        // print the top 2 parks
        sortedEntries.stream()
                .limit(2)  // Limit to the first two entries
                .forEach(entry -> System.out.println("Park Code: " + entry.getKey()));

        response.setData("Compare results successful.");
        response.setResults(sortedParks);
        response.setParkUsers(parkUsers);

        return ResponseEntity.ok().body(response);
    }


    @GetMapping("/suggestions")
    public ResponseEntity<FavoriteResponse> getSuggestResults(@RequestParam ArrayList<Long> allUserIds) {
        FavoriteResponse response = new FavoriteResponse();

        //map to keep track of parks and counts of appearances
        Map<String, Integer> parkCounts = new HashMap<>();
        // Map to keep track of usernames for each park
        Map<String, ArrayList<User>> parkUsers = new HashMap<>();

        for (Long userID : allUserIds) {
            ArrayList<Park> userFavoriteParks = favoriteService.findParksByUserUserID(userID);
            for (Park park : userFavoriteParks) {
                String parkCode = park.getParkCode();

                // Update park count
                parkCounts.put(parkCode, parkCounts.getOrDefault(parkCode, 0) + 1);

                // Get the username for the user ID
                User user = userRepository.findByUserID(userID);
                // Update username list for each park
                parkUsers.computeIfAbsent(parkCode, k -> new ArrayList<>()).add(user);
            }
        }

        //get the max integer value in the map
        int maxFav = Collections.max(parkCounts.values());
        //check if maxFav is 1, because if it is then parks only exist in one user's list
        //no suggestion
        if(maxFav == 1) {
            //return response as No Suggestions
            //return empty list of parks
            response.setData("No Suggestions Found.");
            return ResponseEntity.ok().body(response);

        }

        //remove park codes from the if integer value is less than max
        parkCounts.entrySet().removeIf(entry -> entry.getValue() < maxFav);

        //get percentage to be added to response
        //calculate percentage value = (integer / allUsersIds.size) * 100
        //update response because all suggestions here out will need it
        double percentage = ((double)parkCounts.get(parkCounts.keySet().iterator().next()) / (double)allUserIds.size()) * 100.0;
        String message = percentage + "% match.";
        response.setData(message);

        //stores parks that will end up being suggested to users
        ArrayList<String> suggestedParks = new ArrayList<>();

        //populate suggestedParks with first park only if size is 1
        //will automatically populate in for loop of else, so don't add because don't want it twice
        if(parkCounts.size() == 1) {
            suggestedParks.add(parkCounts.keySet().iterator().next());
        }
        else {
            //parkCounts size is greater than one, so we must figure out individual rankings of parks in users favorites list
            //best Rank will initially be populated based on rank of first park in users tables
            Park firstPark = parkRepository.findByParkCode(parkCounts.keySet().iterator().next());
            ArrayList<User> firstUsers = parkUsers.get(parkCounts.keySet().iterator().next());
            int bestRank = favoriteService.sumRankingForParkByUsers(firstPark, firstUsers);
            for (Map.Entry<String, Integer> currPark : parkCounts.entrySet()) {
                //get park with parkCode and get Users with park Code
                Park park = parkRepository.findByParkCode(currPark.getKey());
                ArrayList<User> users = parkUsers.get(currPark.getKey());

                //call favoriteService
                int rank = favoriteService.sumRankingForParkByUsers(park, users);
                if (rank < bestRank) {
                    //clear the suggestedParks list and put this park there
                    suggestedParks.clear();
                    suggestedParks.add(currPark.getKey());
                    //update highestRank
                    bestRank = rank;
                } else if (rank == bestRank) {
                    //add this rank to the list of suggestedParks
                    //no need to update highestRank because the same
                    suggestedParks.add(currPark.getKey());
                }
            }
        }


        // pass the top park or parks
        response.setSuggest(suggestedParks);

        return ResponseEntity.ok().body(response);
    }

}
