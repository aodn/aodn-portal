package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import au.org.emii.portal.tests.step3.ShapeFileTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.apache.log4j.Logger;

import java.util.List;

public class StepsDisabledTest extends BaseTest {
    private static Logger log = Logger.getLogger(ShapeFileTest.class.getName());

    @Test
    public void stepsDisabledTest() throws InterruptedException{
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        List<WebElement> buttons = webElementUtil.findElements(By.className("viewPortButton"));

        buttons.get(1).click();

        WebElement results = webElementUtil.findElement(By.className("faceted-search-results"));

        Assert.assertTrue(results.isDisplayed(), "Step 2 button works before a collection is added");

        driver.navigate().refresh();
        buttons = webElementUtil.findElements(By.className("viewPortButton"));

        buttons.get(2).click();

        results = webElementUtil.findElement(By.className("faceted-search-results"));

        Assert.assertTrue(results.isDisplayed(), "Step 3 button works before a collection is added");

    }
}
