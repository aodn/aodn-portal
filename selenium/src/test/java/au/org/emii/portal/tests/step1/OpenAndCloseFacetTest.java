package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

public class OpenAndCloseFacetTest extends BaseTest {

    private static Logger log = Logger.getLogger(LoadingIndicatorTest.class.getName());

    @Test
    public void openAndCloseFacets() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        List<WebElement> facets = webElementUtil.findElements(By.className("search-filter-panel"));
        for (WebElement p : facets) {
            WebElement header = p.findElement(By.className("x-panel-header"));
            String facetName = header.getText();

            if(isOpen(p)) {
                header.click();
                Assert.assertFalse (isOpen(p),"Facet " + facetName + " didn't close");
                header.click();
                Assert.assertTrue (isOpen(p), "Facet " + facetName + " didn't re-open");
            }
            else {
                header.click();
                Assert.assertTrue (isOpen(p), "Facet " + facetName + "didn't open");
                header.click();
                Assert.assertFalse (isOpen(p), "Facet " + facetName + "didn't re-close");
            }
        }
    }

    private boolean isOpen(WebElement element) {
        return element.findElement(By.className("x-panel-body")).isDisplayed();
    }
}
