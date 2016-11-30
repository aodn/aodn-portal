package au.org.emii.portal.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

public class PortalUtil {
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
}
