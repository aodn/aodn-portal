package au.org.emii.portal.tests.step3;

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

public class DownloadOptionsTest extends BaseTest {

    private static Logger log = Logger.getLogger(DownloadOptionsTest.class.getName());

    @Test
    public void verifyShapeFile() {
        checkDownloadOptionExists("9d6b28d2-2d6b-4726-b603-ab03e3d15d34", "Shapefile");
    }

    @Test
    public void verifyGoGoduckFile() {
        checkDownloadOptionExists("0c9eb39c-9cbe-4c6a-8a10-5867087e703a", "NetCDF");
    }

    public void checkDownloadOptionExists(String uuid, String downloadOption) {
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE + "?uuid=" + uuid);
        WebDriverWait wait = new WebDriverWait(driver, 30);

        //wait until layer has finished loading, so we can be sure the step 3 button will be clickable
        portalUtil.waitUntilLoadingComplete();

        // Step 3
        webElementUtil.clickButtonWithText("Next");

        wait.until(ExpectedConditions.numberOfElementsToBe(By.xpath("//i[contains(.,'" + "Waiting for Temporal extent to load" + "')]"),0));

        WebElement downloadButton = webElementUtil.findElement(By.xpath("//button[contains(.,'" + " Download as… " + "')]"));
        downloadButton.click();

        WebElement downloadOptionElement = webElementUtil.findElement(By.xpath("//span[contains(.,'" + downloadOption + "')]"));
        Assert.assertNotNull(downloadOptionElement, downloadOption + " download option not displayed:");
    }
}
