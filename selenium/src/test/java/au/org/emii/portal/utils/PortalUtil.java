package au.org.emii.portal.utils;

import org.openqa.selenium.By;

public class PortalUtil {
    private final WebElementUtil webElementUtil;

    public PortalUtil(WebElementUtil webElementUtil) {
        this.webElementUtil = webElementUtil;
    }

    public void selectFacet(String facetName) {
        webElementUtil.clickLinkContainingText(facetName);
        webElementUtil.waitForElement(By.xpath(String.format("//a[contains(., '%s')]/preceding-sibling::input[@checked]", facetName)));
    }
}
