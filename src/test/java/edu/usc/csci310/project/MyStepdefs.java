package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.*;

public class MyStepdefs {
    private static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();
    private final WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(2));
    private final Actions action = new Actions(driver);

    @After
    public void after() {
        driver.quit();
    }

    @Given("on login page")
    public void onLoginPage() {
        driver.get(ROOT_URL);
        // reset failure count from prev tests
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("username"))).sendKeys("tommytrojan");
        driver.findElement(By.id("password")).sendKeys("Password1");
        driver.findElement(By.id("loginButton")).click();
        driver.get(ROOT_URL);
    }

    @Given("on {string} page")
    public void onPage(String arg0) {
        driver.get(ROOT_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("username"))).sendKeys("user0test");
        driver.findElement(By.id("password")).sendKeys("Password1");
        driver.findElement(By.id("loginButton")).click();
        driver.get(ROOT_URL + arg0);
    }


    @Then("redirected to {string} page")
    public void redirectedToPage(String arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertEquals(driver.getCurrentUrl(), ROOT_URL + arg0);
    }

    @When("enter the username {string}")
    public void enterTheUsername(String arg0) {
        driver.findElement(By.id("username")).sendKeys(arg0);
    }

    @And("enter the password {string}")
    public void enterThePassword(String arg0) {
        driver.findElement(By.id("password")).sendKeys(arg0);
    }

    @And("confirm the password {string}")
    public void confirmThePassword(String arg0) {
        driver.findElement(By.id("confirmPassword")).sendKeys(arg0);
    }

    @And("username {string} and password {string} is already registered")
    public void usernameAndPasswordIsAlreadyRegistered(String arg0, String arg1) throws InterruptedException {
        driver.get(ROOT_URL + "signup");
        Thread.sleep(1000);
        driver.findElement(By.id("username")).sendKeys(arg0);
        driver.findElement(By.id("password")).sendKeys(arg1);
        driver.findElement(By.id("confirmPassword")).sendKeys(arg1);
        driver.findElement(By.id("signUpButton")).click();

        // do we create a new user every time or do we just assertTrue that the user is in our db
        // we can add all our test users automatically to our db
    }

    @And("two previous unsuccessful login attempts")
    public void twoPreviousUnsuccessfulLoginAttempts() throws InterruptedException {
        driver.get(ROOT_URL);
        Thread.sleep(1000);
        driver.findElement(By.id("username")).sendKeys("bruin");
        driver.findElement(By.id("password")).sendKeys("Bear1");
        driver.findElement(By.id("loginButton")).click();
        Thread.sleep(1000);
        driver.findElement(By.id("username")).sendKeys("traveler");
        driver.findElement(By.id("password")).sendKeys("theHorse1");
        driver.findElement(By.id("loginButton")).click();
        Thread.sleep(1000);
    }

    @And("account is currently locked")
    public void accountIsCurrentlyLocked() throws InterruptedException {
        twoPreviousUnsuccessfulLoginAttempts();
        driver.findElement(By.id("username")).sendKeys("oski");
        driver.findElement(By.id("password")).sendKeys("Bear2");
        driver.findElement(By.id("loginButton")).click();
    }

    @When("wait {int} seconds")
    public void waitSeconds(int arg0) throws InterruptedException {
        Thread.sleep(arg0* 1000L);
    }

    @When("click {string} button")
    public void clickButton(String arg0) {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id(arg0))).click();
    }

    @Then("display {string} on page")
    public void displayOnPage(String arg0) throws InterruptedException {
        Thread.sleep(2000);
        assertTrue(driver.getPageSource().contains(arg0));

    }

    // favorites functionality.
    @When("add {string} to favorites")
    public void addToFavorites(String arg0) {
        String parkDiv = "search-" + arg0;
        String addPark = "addFavorite-" + arg0;

        // hover and click.
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id(parkDiv))).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id(addPark))).click();
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());  // Wait for the alert to appear
        alert.accept();


    }

    @Then("display empty favorites page")
    public void displayEmptyFavoritesPage() {
        assertTrue(driver.getPageSource().contains("No parks in favorites. Add some parks."));
    }

    @Then("don't display {string} on page")
    public void donTDisplayOnPage(String arg0) {
        String element = driver.findElement(By.xpath("//*[contains(text(), '" + arg0 + "')]")).toString();
        assertTrue(element.isEmpty());
    }

    @And("display {string} above {string}")
    public void displayAbove(String arg0, String arg1) {

    }

    @When("click move up ranking on {string}")
    public void clickMoveUpRankingOn(String arg0) {

    }

    @When("click move down ranking on {string}")
    public void clickMoveDownRankingOn(String arg0) {
    }

    @And("favorites list is private")
    public void favoritesListIsPrivate() {
    }

    @And("favorites list is public")
    public void favoritesListIsPublic() {

    }

    @Then("boolean private {string}")
    public void booleanPrivate(String arg0) {
    }

    // Search functionality.

    // search bar in search page.
    @And("search {string}")
    public void search(String arg0) throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(
                "/html/body/div/div/div/div/div/input"))).sendKeys(arg0);
        driver.findElement(By.id("search-bar-button")).click();
        Thread.sleep(1000);
    }

    @When("Click filter by {string}")
    public void clickFilterBy(String arg0) {


    }

    @Then("{int} more results appear")
    public void moreResultsAppear(int arg0) {

    }

    @Then("{string} is not displayed")
    public void isNotDisplayed(String arg0) {
        // assertFalse(driver.getPageSource().contains(arg0));
    }

    @And("click Yellowstone National Park park name")
    public void clickYellowstoneNationalParkParkName() {
        //action.moveToElement(element).click().build().perform();
        // need element to be the div of the arg0 park


    }

    @And("click {string} text")
    public void clickText(String arg0) {
        // driver.findElement(By.xpath("//*[contains(text(), '" + arg0 + "')]")).click();
    }

    @Then("inline div is closed")
    public void inlineDivIsClosed() {

    }

    @And("click Accessible Rooms amenity")
    public void clickAccessibleRoomsAmenity() {
    }

    // Compare + suggestion functionality.
    @When("I search {string} in compare")
    public void iSearchInCompare(String arg0) throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("uname"))).sendKeys(arg0);
        driver.findElement(By.id("add")).click();
        Thread.sleep(1000);

    }

    @And("I hover over yosemite national park ratio")
    public void iHoverOverYosemiteNationalParkRatio() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("/html/body/div/div/div/div/div[3]/div[2]/div[1]/button"))).click();
    }

    @And("click Yosemite National Park park name")
    public void clickYosemiteNationalParkParkName() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("/html/body/div[1]/div/div/div/div[3]/div[1]/div[2]/div/div/h1"))).click();
    }

    @When("navigate to url of {string} page")
    public void navigateToUrlOfPage(String arg0) {
    }

    @When("the session is inactive for a given time period")
    public void theSessionIsInactiveForAGivenTimePeriodMinutes(int arg0) {

    }

    @Given("a user session")
    public void aUserSession() {

    }

    @And("new session")
    public void newSession() {

    }
}