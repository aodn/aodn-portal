package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class FacetUntickTest extends BaseTest {

    private static Logger log = Logger.getLogger(FacetUntickTest.class.getName());

    @Test
    public void untickFacetTest() throws InterruptedException {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        WebDriverWait wait = new WebDriverWait(getDriver(), 30);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("resultsHeaderBackground")));

        // grab the text of the original results so we can make sure it reverts back when we untick later
        String originalResults = webElementUtil.findElement(By.className("faceted-search-results")).getText();
        List<WebElement> facetEntries = getFacetEntries();
        List<String> originalTitles = getFacetTitles(facetEntries);

        //open up a facet (doesn't matter which)
        facetEntries.get(0).click();
        wait.until(ExpectedConditions.stalenessOf(facetEntries.get(0)));

        //grab the new stuff
        facetEntries = getFacetEntries();
        List<String> latestTitles = getFacetTitles(facetEntries);

        Assert.assertNotEquals(latestTitles, originalTitles, "Facets not changed after selection");

        WebElement checkBox = null;
        try {
            checkBox = driver.findElement(By.className("search-filter-panel").xpath("//input[@type='checkbox']"));
        } catch(NoSuchElementException e) {
            Assert.fail("No checkbox found after facet selected");
        }

        //untick the facet check box
        checkBox.click();
        wait.until(ExpectedConditions.stalenessOf(facetEntries.get(0)));

        //grab the new new stuff (which should be the same as the original stuff)
        facetEntries = getFacetEntries();
        latestTitles = getFacetTitles(facetEntries);

        Assert.assertEquals(latestTitles, originalTitles,"Facets have not reverted to initial state after unticking checkbox");

        String newResults = webElementUtil.findElement(By.className("faceted-search-results")).getText();
        Assert.assertTrue(newResults.equals(originalResults),"Results have not reverted to initial state after unticking checkbox");
    }

    //returns a list of WebElements, each representing an entry in the facet list of the top facet panel.
    private List<WebElement> getFacetEntries() {
        WebElement topPanel = webElementUtil.findElement(By.className("search-filter-panel"));
        List<WebElement> facetEntries = topPanel.findElements(By.tagName("a"));
        return facetEntries;
    }

    //returns the titles of the given facet entries
    private List<String> getFacetTitles(List<WebElement> facetEntries) {
        List<String> titles = new ArrayList();
        for(WebElement entry: facetEntries ) {
            titles.add(entry.getText());
        }
        return titles;
    }
}
