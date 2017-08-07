package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class GeographicFacetTest extends BaseTest {

    private static Logger log = Logger.getLogger(GeographicFacetTest.class.getName());

    @Test
    public void defaultButtonTest() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Geographic Boundary Facet");
        portalUtil.selectFacetHeading("Geographic Boundary");

        WebElement element = getDriver().findElement(By.className("olControlDrawFeatureItemActive"));
        Assert.assertNotNull(element);

        log.info("Validation Complete");
    }
}
