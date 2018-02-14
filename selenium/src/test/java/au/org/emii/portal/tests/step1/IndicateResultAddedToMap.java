package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;


public class IndicateResultAddedToMap extends BaseTest {

    private static Logger log = Logger.getLogger(IndicateResultAddedToMap.class.getName());


    @Test
    public void testCollectionAdded() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        //the first collection button div
        WebElement collectionDiv = driver.findElements(By.className("facetedSearchBtn")).get(0);

        //test button is not already selected
        Assert.assertFalse(
                collectionDiv.findElement(By.tagName("table")).getAttribute("class").contains("x-btn-selected"),
                "button is not shown as selected"
        );

        //click the button
        collectionDiv.findElement(By.tagName("button")).click();

        //return to select data collection tab
        driver.findElement(By.xpath("//*[@id=\"viewPortTab0\"]/button")).click();

        //get the first collection button div again
        collectionDiv = driver.findElements(By.className("facetedSearchBtn")).get(0);
        WebElement table = collectionDiv.findElement(By.tagName("table"));

        Assert.assertTrue(table.getAttribute("class").contains("x-btn-selected"), "button is shown as selected");
    }
}
