package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.concurrent.TimeUnit;

public class FacetDateGoButton extends BaseTest {

    private static Logger log = Logger.getLogger(FacetDateGoButton.class.getName());

    @Test
    public void goButtonTest() {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Date Facet");
        portalUtil.selectFacetHeading("Parameter");
        portalUtil.selectFacetHeading("Platform");
        portalUtil.selectFacetHeading("Date (UTC)");

        WebElement goButton = portalUtil.getFacetHeadingElement("Date (UTC)").findElement(By.xpath("//button[contains(.,'Go')]"));
        WebElement parentElement = goButton.findElement(By.xpath("./../../../../.."));
        Assert.assertTrue(parentElement.getAttribute("class").contains("x-item-disabled"), "Go button should not be enabled");

        webElementUtil.findElement(By.xpath("//input[@name='extFrom']")).sendKeys("1991-11-22");
        webElementUtil.findElement(By.xpath("//input[@name='extTo']")).sendKeys("1992-11-22");
        webElementUtil.clickButtonWithText("Go");
        portalUtil.validateFacetHeading("1991");

        log.info("Validation Complete");
    }
}
