# Let's Go Camping!

Let’s Go Camping! is an interactive web app that helps users explore, save, and compare national parks across the United States. Users can search parks by name, state, activities, and amenities, curate a personal list of favorites, and compare their list with friends to discover shared interests and top park matches. The application emphasizes user security, responsive design, accessibility, and interactive social features.

## Use Cases
User Registration & Login: Secure login with account lockout protection. Guest access with limited features.<br>
Park Search: Users can search by name, state, activity, and amenity.<br>
Favorites Management for Registered Users: Add/remove/rank parks in a personal list, mark list public/private.<br>
Friends Comparison: Add friends and compare park lists to find shared favorites.<br>
Park Recommendation: Suggest a park most commonly favorited among selected users.<br>

## Software Architecture
Frontend: React.js<br>
Backend: Spring Boot (Java)<br>
Database: H2 (in-memory, persisted across sessions)<br>
Authentication: Spring Security + JWT<br>
API Source: National Park Service API<br>
Testing: JUnit + Mockito (Backend), React Testing Library (Frontend)<br>

## Data Flow

### Registration & Login
Data: username, password (encrypted), name.<br>
Storage: H2 (users collection, encrypted fields)<br>
Lockout: login attempts are tracked with timestamped counters.<br>

### Park Search
Fetched live from NPS API.<br>
Filters: Name, State, Activity, Amenity.<br>
Search results temporarily stored client-side for performance.<br>

### Favorites List
Stored per user in H2.<br>
Ranked list with order retained across sessions.<br>
Public/private flag stored with user profile.<br>

### Friend Comparison
Search by username.<br>
Query other users’ public favorites lists.<br>
Matching parks are aggregated and ranked by frequency.<br>

## Running the App Locally
You can run the Let’s Go Camping! application locally in development using the following steps.<br>

*Prerequisites*
1. [Java 17+](https://adoptopenjdk.net/)
2. [Maven](https://maven.apache.org/install.html)
3. [Node.js (v18+ recommended)](https://nodejs.org/)

### Quickstart (Frontend + Backend)

1. **Clone the repository**
```bash
git clone https://github.com/nicole-t-black/lets-go-camping.git
cd lets-go-camping
```
2. **Start the app**
```bash
mvn compile
mvn spring-boot:run
```
The app will be available at: [http://localhost:8080](http://localhost:8080)

### Running Tests

To run the project's acceptance tests, use `mvn integration-test`. Cucumber can be configured to run a subset of the features by modifying the `junit-platform.properties` file in the `src/test/resources` folder
