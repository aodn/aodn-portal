package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.apache.log4j.Logger;

import java.util.List;

public class StepsDisabledTest extends BaseTest {
    private static Logger log = Logger.getLogger(StepsDisabledTest.class.getName());

    @Test
    public void stepsDisabledTest() throws InterruptedException{
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        //test step 2 button
        List<WebElement> buttons = webElementUtil.findElements(By.className("viewPortButton"));

        WebElement step2Button = null;
        for(WebElement button:buttons) {
            if (button.getText().contains("Create a Subset")) {
                step2Button = button;
            }
        }

        Assert.assertNotNull(step2Button,"No Step 2 ('Create a Subset') button found");
        step2Button.click();

        WebElement results = webElementUtil.findElement(By.className("faceted-search-results"));

        Assert.assertTrue(results.isDisplayed(), "Step 2 ('Create a Subset') button works before a collection is added");

        //now we test step 3 button
        driver.navigate().refresh();
        buttons = webElementUtil.findElements(By.className("viewPortButton"));

        WebElement step3Button = null;
        for(WebElement button:buttons) {
            if (button.getText().contains("Download")) {
                step3Button = button;
            }
        }

        Assert.assertNotNull(step3Button,"No Step 3 ('Download') button found");
        step3Button.click();

        results = webElementUtil.findElement(By.className("faceted-search-results"));

        Assert.assertTrue(results.isDisplayed(), "Step 3 ('download') button works before a collection is added");

    }
}
