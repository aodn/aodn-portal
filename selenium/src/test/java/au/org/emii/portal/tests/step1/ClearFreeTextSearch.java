package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;


public class ClearFreeTextSearch extends BaseTest {

    private static Logger log = Logger.getLogger(ClearFreeTextSearch.class.getName());


    private int currentPageCount() {

        //get total number of pages prior to any searching
        WebElement lastPage = webElementUtil.findElement(By.xpath("//div[@class='xtb-text' and contains(.,'of ')]"));
        return Integer.parseInt(lastPage.getText().substring(3));
    }

    @Test
    public void clearFreeTextSearch() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        String searchTerm = "temperature";
        int initialPageCount = currentPageCount();
        log.info("initial page count: " + String.valueOf(initialPageCount));

        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for (WebElement p : filterPanels) {
            if (p.getText().contains("Keyword")) {
                panel = p;
            }
        }

        WebElement stalenessCheck = webElementUtil.findElements(By.className("resultsHeaderBackground")).get(0);

        //do text search
        WebElement searchInput = panel.findElement(By.tagName("input"));
        searchInput.sendKeys(searchTerm);
        searchInput.sendKeys(Keys.RETURN);

        //wait and get filtered results
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.stalenessOf(stalenessCheck));

        int searchedPageCount = currentPageCount();

        log.info("searched page count: " + String.valueOf(searchedPageCount));
        Assert.assertNotEquals(initialPageCount, searchedPageCount);

        stalenessCheck = webElementUtil.findElements(By.className("resultsHeaderBackground")).get(0);

        //clear search
        WebElement keywordFacet = webElementUtil.findElement(By.className("free-text-search"));
        keywordFacet.findElements(By.tagName("a")).get(0).click();

        wait.until(ExpectedConditions.stalenessOf(stalenessCheck));
        int finalPageCount = currentPageCount();
        log.info("final page count: " + String.valueOf(finalPageCount));

        //page count after search cleared should be same as initial page count
        Assert.assertEquals(initialPageCount, finalPageCount);
    }
}
