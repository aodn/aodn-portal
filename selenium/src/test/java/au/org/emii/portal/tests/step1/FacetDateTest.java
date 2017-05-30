package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

public class FacetDateTest extends BaseTest {

    private static Logger log = Logger.getLogger(FacetDateTest.class.getName());

    @Test
    public void facetDateTest() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Date Facet");
        portalUtil.selectFacetHeading("Parameter");
        portalUtil.selectFacetHeading("Platform");
        portalUtil.selectFacetHeading("Date (UTC)");

        WebElement goButton = portalUtil.getFacetHeadingElement("Date (UTC)").findElement(By.xpath("//button[contains(.,'Go')]"));
        WebElement parentElement = goButton.findElement(By.xpath("./../../../../.."));
        Assert.assertTrue(parentElement.getAttribute("class").contains("x-item-disabled"), "Go button should not be enabled");

        webElementUtil.findElement(By.xpath("//input[@name='extFrom']")).sendKeys("1991-01-01");
        webElementUtil.findElement(By.xpath("//input[@name='extTo']")).sendKeys("1991-12-31");

        //grab the old results so we can wait for them to become stale
        List<WebElement> oldResults = webElementUtil.findElements(By.className("resultsTextBody"));

        webElementUtil.clickButtonWithText("Go");
        portalUtil.validateFacetHeading("1991");

        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.stalenessOf(oldResults.get(0)));

        List<WebElement> headers = webElementUtil.findElements(By.className("resultsHeaderBackground"));

        for (WebElement header : headers) {
            //sometimes the orgs section is too long, so we need to expand to see the years
            header.click();

            List<WebElement> facetResults = header.findElements(By.xpath("div[2]/div[2]/div/span[2]"));

            //the second div has the years
            String yearsString = facetResults.get(1).getText();
            String[] years = yearsString.split(" - ");

            Assert.assertTrue(Integer.parseInt(years[0]) <= 1991, "Result not within given date range");
            Assert.assertTrue(Integer.parseInt(years[1]) >= 1991, "Result not within given date range");
        }

        log.info("Validation Complete");
    }
}
