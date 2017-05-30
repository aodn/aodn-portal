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

public class FacetOrganisationTest extends BaseTest {

    private static Logger log = Logger.getLogger(FacetOrganisationTest.class.getName());

    @Test
    public void organisationTest() throws InterruptedException {
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);


        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for(WebElement p : filterPanels) {
            if(p.getText().contains("Organisation")) {
                panel=p;
            }
        }

        //open up the organisations panel, since it starts closed
        panel.click();

        List<WebElement> orgs = panel.findElements(By.tagName("a"));

        //The orgs WebElements will go stale, so we keep a list of their names to use throughout the test
        List<String> orgNames = new ArrayList<String>();

        log.info("Getting Organisation names");
        for(WebElement org: orgs) {
            orgNames.add(org.getText());
        }

        for(String orgName: orgNames) {
           verifyOrganisation(orgName);
        }
    }

    private void verifyOrganisation(String org) {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for(WebElement p : filterPanels) {
            if(p.getText().contains("Organisation")) {
                panel=p;
            }
        }

        //open up the organisations panel, since it starts closed
        panel.click();

        portalUtil.selectFacet(org);

        //now convert to just the org name, without the number of results
        String orgName = org.split(" \\(\\d{1,}\\)")[0];
        log.info("Checking Organisation:" + orgName);

        //now get the number of results given after the name
        int resultsCount = Integer.parseInt(org.substring(orgName.length()+2,org.length()-1));

        WebElement lastPage = webElementUtil.findElement(By.xpath("//div[@class='xtb-text' and contains(.,'of ')]"));
        int numberOfPages = Integer.parseInt(lastPage.getText().substring(3));
        int expectedNumberOfPages = (int)Math.ceil((double)resultsCount/10);

        Assert.assertEquals(numberOfPages, expectedNumberOfPages, "Incorrect number of pages returned for " + orgName);

        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            WebElement facetResult = result.findElement(By.xpath("//span[contains(@class, 'fa-institution')]/../following-sibling::span"));
            Assert.assertTrue(facetResult.getText().contains(orgName));
        }

        if(numberOfPages>1) {
            log.info("Loading last page to check results count");
            webElementUtil.clickButtonWithClass("fa-fast-forward");
            WebDriverWait wait = new WebDriverWait(driver, 30);
            wait.until(ExpectedConditions.stalenessOf(results.get(0)));
            results = webElementUtil.findElements(By.className("resultsTextBody"));
        }
        int expectedLastPageResults = (resultsCount % 10 == 0) ? 10 : resultsCount % 10;

        Assert.assertEquals(results.size(), expectedLastPageResults, "Incorrect number of results returned");
    }
}
