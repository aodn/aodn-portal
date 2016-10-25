package au.org.emii.portal.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DownloadOptionTest extends BaseTest {

    @Test
    public void downloadOptionTest() {
        // Step 1
        getDriver().get(AODN_PORTAL_SEARCH_PAGE+"?uuid=aaad092c-c3af-42e6-87e0-bdaef945f522");

        // Step 2
        WebDriverWait wait = new WebDriverWait(getDriver(),10);
        wait.until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver driver) {
                WebElement fromDate = webElementUtil.findElement(By.className("start-date"));
                String value = fromDate.getAttribute("value");
                if(value.contains("Loading"))
                    return false;
                else
                    return true;
            }
        });

        WebElement toDate = webElementUtil.findElement(By.className("end-date"));
        toDate.clear();
        toDate.sendKeys(new String[]{"1992/03/24"});
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        webElementUtil.clickButtonWithText(" Download as… ");
        WebElement propertyOption = webElementUtil.findElement(By.xpath("//span[contains(.,'Property')]"));
        Assert.assertNotNull(propertyOption);
        propertyOption.click();
        webElementUtil.clickButtonWithText("I understand, download");

        String errorMsg = "There is a problem with the availability of your selected data download.";
        WebElement error = webElementUtil.findElement(By.xpath("//span[contains(.,'"+ errorMsg +"')]"));
        Assert.assertNull(error, errorMsg);
    }
}
