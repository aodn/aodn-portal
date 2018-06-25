package au.org.emii.portal.tests.step3;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;
import au.org.emii.portal.tests.BaseTest;

public class NoFilterMessage extends BaseTest {

        @Test
        public void verifyFiltersEmpty() {
            loadStep2("ae86e2f5-eaaf-459e-a405-e654d85adb9c");

            // Step 3
            webElementUtil.clickButtonWithText("Next");

            WebElement downloadPanel = webElementUtil.findElements(By.className("downloadPanelItem")).get(1);
            WebElement warning = downloadPanel.findElement(By.className("alert-warning"));
            Assert.assertTrue(warning.isDisplayed());
            Assert.assertTrue(warning.getText().contains("The full data collection will be downloaded. Please consider filtering the collection."));

        }

        private void loadStep2(String uuid) {
            WebDriver driver = getDriver();
            driver.get(AODN_PORTAL_SEARCH_PAGE + "?uuid=" + uuid);
            WebDriverWait wait = new WebDriverWait(driver, 30);

            //wait until layer has finished loading, so we can be sure the step 3 button will be clickable
            portalUtil.waitUntilLoadingComplete();
        }
}
