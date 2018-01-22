package au.org.emii.portal.tests.step3;

import au.org.emii.portal.tests.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

public class EmptyDataTest extends BaseTest {

    @Test
    public void verifySpatialEmpty() {
        loadStep2("ae86e2f5-eaaf-459e-a405-e654d85adb9c");

        WebElement northInput = webElementUtil.findElement(By.name("northBL"));
        WebElement southInput = webElementUtil.findElement(By.name("southBL"));
        WebElement eastInput = webElementUtil.findElement(By.name("eastBL"));
        WebElement westInput = webElementUtil.findElement(By.name("westBL"));

        northInput.sendKeys("-2");
        southInput.sendKeys("2");
        eastInput.sendKeys("-2");
        westInput.sendKeys("2");
        westInput.sendKeys(Keys.TAB);

        confirmStep3Erorr();
    }

    @Test
    public void verifyTemporalEmpty() {
        loadStep2("ae86e2f5-eaaf-459e-a405-e654d85adb9c");

        WebElement toDateInput = webElementUtil.findElement(By.name("toDate"));

        toDateInput.sendKeys("1900-01-01");
        toDateInput.sendKeys(Keys.TAB);

        confirmStep3Erorr();
    }

    private void confirmStep3Erorr() {
        // Step 3
        webElementUtil.clickButtonWithText("Next");

        WebElement downloadPanel = webElementUtil.findElements(By.className("downloadPanelItem")).get(1);
        WebElement warning = downloadPanel.findElement(By.className("alert-warning"));
        Assert.assertTrue(warning.isDisplayed());
        Assert.assertTrue(warning.getText().contains("No data is available using your chosen subset."));

        //check that download button exists and is disabled
        boolean found = false;
        for (WebElement disabled : downloadPanel.findElements(By.className("x-item-disabled"))) {
            if (disabled.findElement(By.xpath("//button[contains(.,'" + " Download as… " + "')]")) != null) {
                found = true;
                break;
            }
        }

        if (!found) {
            throw new AssertionError("No disabled download button found");
        }
    }

    private void loadStep2(String uuid) {
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE + "?uuid=" + uuid);
        WebDriverWait wait = new WebDriverWait(driver, 30);

        //wait until layer has finished loading, so we can be sure the step 3 button will be clickable
        portalUtil.waitUntilLoadingComplete();
    }
}
