package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PreviousButtonTest extends BaseTest {

    @Test
    public void previousButtonTest() throws InterruptedException{
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        WebElement previousButton = getPreviousButton();
        Assert.assertFalse(previousButton.isDisplayed());

        webElementUtil.clickButtonWithTitle("Add this collection");

        previousButton = getPreviousButton();
        Assert.assertTrue(previousButton.isDisplayed());

        webElementUtil.click(previousButton);

        previousButton = getPreviousButton();
        Assert.assertFalse(previousButton.isDisplayed());
    }

    private WebElement getPreviousButton() {
        return webElementUtil.findElement(By.className("backwardsButton")).findElement(By.tagName("button"));
    }
}
