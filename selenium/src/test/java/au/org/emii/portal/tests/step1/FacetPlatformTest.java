package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class FacetPlatformTest extends BaseTest {

    private static Logger log = Logger.getLogger(FacetPlatformTest.class.getName());

    @Test
    public void platformTest() throws InterruptedException {
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);


        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for(WebElement p : filterPanels) {
            if(p.getText().contains("Platform")) {
                panel=p;
            }
        }

        List<WebElement> platforms = panel.findElements(By.tagName("a"));

        //The platform WebElements will go stale, so we keep a list of their names to use throughout the test
        List<String> platformNames = new ArrayList<String>();

        log.info("Getting Platform names");
        for(WebElement platform: platforms) {
            String platformName = platform.getText().split(" \\(\\d{1,}\\)")[0];
            platformNames.add(platformName);
        }

        for(String platformName: platformNames) {
            verifyFacetResults(platformName);
        }
    }

    private void verifyFacetResults(String parameter) {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        portalUtil.selectFacet(parameter);

        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            try {
                WebElement facetResult = result.findElement(By.xpath("div[4]/span[2]"));
                Assert.assertTrue(facetResult.getText().contains(parameter));
            } catch (NoSuchElementException e) {
                Assert.fail("No platform section in results but " + parameter + " parameter should be present");
            }

        }



    }
}
