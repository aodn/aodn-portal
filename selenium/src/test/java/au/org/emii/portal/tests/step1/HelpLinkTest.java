package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class HelpLinkTest extends BaseTest {

    @Test
    public void linkTest() {
        goToSearchPage();

        // Step 1
        validateHelpElement();
        webElementUtil.clickButtonWithTitle("Add this collection");

        // Step 2
        validateHelpElement();
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        validateHelpElement();
    }

    private WebElement getHelpElement() {
        WebElement helpDivElement = webElementUtil.findElement(By.id("toplinks"));
        WebElement helpElement = helpDivElement.findElement(By.tagName("a"));
        Assert.assertNotNull(helpElement);
        return helpElement;
    }

    private void validateHelpElement() {
        WebElement helpElement = getHelpElement();
        webElementUtil.click(helpElement);
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Portal User Guide");
        webElementUtil.verifyInnerHtml("This is a guide for using the Australian Ocean Data Network (AODN) Portal.");
        webElementUtil.switchToOriginalTab();
    }
}
