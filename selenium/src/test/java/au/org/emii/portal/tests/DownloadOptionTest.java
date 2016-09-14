package au.org.emii.portal.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DownloadOptionTest extends BaseTest {

    @Test
    public void downloadOptionTest() {
        goToSearchPage();

        // Step 1
        webElementUtil.clickSpanWithText("Keyword");
        WebElement keyword = webElementUtil.findElement(By.className("x-form-text x-form-field x-box-item"));
        keyword.sendKeys(new String[]{"aaad092c-c3af-42e6-87e0-bdaef945f522"});
        webElementUtil.clickButtonWithText("Go");
        webElementUtil.clickButtonWithTitle("Add this collection");

        // Step 2
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        webElementUtil.clickButtonWithText(" Download as… ");
        WebElement propertyOption = webElementUtil.findElement(By.xpath("//span[contains(.,'Property')]"));
        Assert.assertNotNull(propertyOption);
        webElementUtil.click(propertyOption);
        getDriver().switchTo().frame(webElementUtil.findElement(By.className(" x-window x-resizable-pinned")));
        webElementUtil.clickButtonWithText("I understand, download");
    }
}
