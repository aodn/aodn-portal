package au.org.emii.portal.utils;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.List;

import static au.org.emii.portal.tests.BaseTest.AODN_PORTAL_SEARCH_PAGE;

public class PortalUtil {
    private static Logger log = Logger.getLogger(WebElementUtil.class.getName());

    private final WebElementUtil webElementUtil;

    public PortalUtil(WebElementUtil webElementUtil) {
        this.webElementUtil = webElementUtil;
    }

    public void selectFacet(String facetName) {
        webElementUtil.clickLinkContainingText(facetName);
        webElementUtil.waitForElement(By.xpath(String.format("//a[contains(., '%s')]/preceding-sibling::input[@checked]", facetName)));
    }

    public void verifyFacetResults(WebDriver driver, String firstLevelFacet, String secondLevelFacet) {
        log.info("Loading search page - Step 1");
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        selectFacet(firstLevelFacet);
        selectFacet(secondLevelFacet);

        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            WebElement facetResult = result.findElement(By.xpath("div[1]/span[2]"));
            Assert.assertTrue(facetResult.getText().contains(secondLevelFacet));
        }
    }

    private String getFacetHeadingXpath(String facetHeading) {
        return String.format("//span[contains(.,'%s') and @class='x-panel-header-text']", facetHeading);
    }

    public void selectFacetHeading(String facetHeading) {
        getFacetHeadingElement(facetHeading).click();
    }

    public WebElement getFacetHeadingElement(String facetHeading) {
        return webElementUtil.findElement(By.xpath(getFacetHeadingXpath(facetHeading)));
    }

    public void waitForSearchPanelReload(String oldDataCollectionText) {

        int attempts = 1, totalAttempts = 2;
        while(attempts <= totalAttempts) {
            try {
                WebDriverWait wait = new WebDriverWait(webElementUtil.driver, webElementUtil.TIMEOUT);
                wait.until(ExpectedConditions.not(ExpectedConditions.textToBePresentInElement(
                        webElementUtil.findElement(By.xpath("//div[@class=\"resultsRowHeaderTitle\"][1]/h3")), oldDataCollectionText)));
                break;
            } catch(Exception e) {
                log.debug(String.format("Attempt: %s Total Attempts: %s", attempts, totalAttempts));
                log.debug(String.format("Error:%s", e.getMessage()));
            }
            attempts++;
        }
    }
}
