package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

public class ExpandCollapseLargeRecordTest extends BaseTest {

    private static Logger log = Logger.getLogger(ExpandCollapseLargeRecordTest.class.getName());

    @Test
    public void expandCollapseLargeRecordTest() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);
        WebDriverWait wait = new WebDriverWait(driver, 30);

        // Search for phytoplankton records
        WebElement keyword = webElementUtil.findElement(By.xpath("//*[contains(@class, 'free-text-search')]/div[2]/div/div[2]/div/input"));
        Assert.assertNotNull(keyword);
        keyword.clear();
        keyword.sendKeys(new String[]{"16e191c0-6b64-482b-affd-783fc2023df4"});
        keyword.sendKeys(Keys.ENTER);

        // Wait until the search completes
        List<WebElement> spinners = webElementUtil.findElements(By.className("fa-spinner"));
        wait.until(ExpectedConditions.invisibilityOfAllElements(spinners));

        int numberOfRecords = webElementUtil.findElements(By.className("resultsHeaderBackground")).size();

        for (int i = 0; i < numberOfRecords; i++) {
            List<WebElement> facetedSearchResults = webElementUtil.findElements(By.className("facetedSearchResultBody"));
            WebElement record = facetedSearchResults.get(i);

            List<WebElement> recordHeaders = webElementUtil.findElements(By.className("resultsHeaderBackground"));
            WebElement recordHeader = recordHeaders.get(i);

            String originalHeight = record.getAttribute("style");
            expandRecord(record, recordHeader, originalHeight);
            collapseRecord(record, recordHeader, originalHeight);
        }

        log.info("Validation Complete");
    }

    private void expandRecord(WebElement record, WebElement recordHeader, String originalHeight) {
        String newHeight = clickRecordAndGetNewHeight(record, recordHeader);
        Assert.assertFalse(newHeight.contains(originalHeight));
    }

    private void collapseRecord(WebElement record, WebElement recordHeader, String originalHeight) {
        String newHeight = clickRecordAndGetNewHeight(record, recordHeader);
        Assert.assertTrue(newHeight.contains(originalHeight));
    }

    private String clickRecordAndGetNewHeight(WebElement record, WebElement recordHeader) {
        recordHeader.click();
        webElementUtil.waitUntilAnimationIsDone("facetedSearchResultBody");
        return record.getAttribute("style");
    }
}
