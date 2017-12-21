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

        // Search for phytoplankton records
        WebElement keyword = webElementUtil.findElement(By.xpath("//*[contains(@class, 'free-text-search')]/div[2]/div/div[2]/div/input"));
        Assert.assertNotNull(keyword);
        keyword.clear();
        keyword.sendKeys(new String[]{"16e191c0-6b64-482b-affd-783fc2023df4"});
        keyword.sendKeys(Keys.ENTER);

        // Wait until the search completes
        portalUtil.waitUntilLoadingComplete();

        List<WebElement> resultsHeaderBackgrounds = webElementUtil.findElements(By.className("resultsHeaderBackground"));

        for (int i = 0; i < resultsHeaderBackgrounds.size(); i++) {

            WebElement parent = resultsHeaderBackgrounds.get(i);
            WebElement facetedSearchResultBody = parent.findElement(By.className("facetedSearchResultBody"));

            String originalHeight = facetedSearchResultBody.getAttribute("style");
            expandRecord(parent, facetedSearchResultBody, originalHeight);
            collapseRecord(parent, facetedSearchResultBody, originalHeight);
        }
        log.info("Validation Complete");
    }

    private void expandRecord(WebElement parent, WebElement facetedSearchResultBody, String originalHeight) {

        String newHeight = clickRecordAndGetNewHeight(parent, facetedSearchResultBody);
        Assert.assertFalse(newHeight.contains(originalHeight));
    }

    private void collapseRecord(WebElement parent, WebElement facetedSearchResultBody, String originalHeight) {

        String newHeight = clickRecordAndGetNewHeight(parent, facetedSearchResultBody);
        Assert.assertTrue(newHeight.contains(originalHeight));
    }

    private String clickRecordAndGetNewHeight(WebElement parent, WebElement facetedSearchResultBody) {

        parent.click();
        webElementUtil.waitUntilAnimationIsDone("facetedSearchResultBody");
        return facetedSearchResultBody.getAttribute("style");
    }
}
