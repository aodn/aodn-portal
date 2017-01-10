package au.org.emii.portal.utils;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

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

    private String getFacetHeadingXpath(String facetHeading) {
        return String.format("//span[contains(.,'%s') and @class='x-panel-header-text']", facetHeading);
    }

    public void selectFacetHeading(String facetHeading) {
        getFacetHeadingElement(facetHeading).click();
    }

    public WebElement getFacetHeadingElement(String facetHeading) {
        return webElementUtil.findElement(By.xpath(getFacetHeadingXpath(facetHeading)));
    }

    public void validateFacetHeading(String facetHeading) {
        WebElement facetHeadingElement = getFacetHeadingElement(facetHeading);
        Assert.assertNotNull(facetHeadingElement, String.format("Unable to find facet heading with text %s", facetHeading));
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
