package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;


public class AddCollectionsToMap extends BaseTest {

    private static Logger log = Logger.getLogger(AddCollectionsToMap.class.getName());

    @Test
    public void testButtonsStartUnselected() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);
        List<WebElement> collectionDivs = driver.findElements(By.className("facetedSearchBtn"));

        for (WebElement e : collectionDivs) {
            WebElement table = e.findElement(By.tagName("table"));
            Assert.assertFalse(table.getAttribute("class").contains("x-btn-selected"), "button not shown as selected");
        }
    }

    @Test
    public void testCollectionAdded() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        //the first collection button div
        WebElement collectionDiv = driver.findElements(By.className("facetedSearchBtn")).get(0);

        //click the button
        collectionDiv.findElement(By.tagName("button")).click();

        //return to select data collection tab
        driver.findElement(By.xpath("//*[@id=\"viewPortTab0\"]/button")).click();

        //get the first collection button div again
        collectionDiv = driver.findElements(By.className("facetedSearchBtn")).get(0);
        WebElement table = collectionDiv.findElement(By.tagName("table"));

        Assert.assertTrue(table.getAttribute("class").contains("x-btn-selected"), "button not shown as selected but should be");
    }


    @Test
    public void testMultipleCollectionsAddedWithControlClick() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        WebElement button = driver.findElements(By.className("facetedSearchBtn")).get(0).findElement(By.tagName("button"));

        Actions actions = new Actions(driver);
        actions.keyDown(Keys.LEFT_CONTROL).click(button)
                .build().perform();

        button = driver.findElements(By.className("facetedSearchBtn")).get(1).findElement(By.tagName("button"));
        actions.click(button)
                .build().perform();

        button = driver.findElements(By.className("facetedSearchBtn")).get(2).findElement(By.tagName("button"));
        actions.click(button)
                .build().perform();

        List<WebElement> collectionDivs = driver.findElements(By.className("facetedSearchBtn"));

        for (int i = 0; i < 3; i++) {
           WebElement table = collectionDivs.get(i).findElement(By.tagName("table"));
           Assert.assertTrue(table.getAttribute("class").contains("x-btn-selected"), "button not shown as selected but should be");
        }

    }

}
