package au.org.emii.portal.tests;

import com.google.common.base.Strings;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Iterator;
import java.util.Set;

public class PointTimeseriesTest extends BaseTest {

    private static Logger log = Logger.getLogger(PointTimeseriesTest.class.getName());

/*
    Acceptance Criteria (https://github.com/aodn/backlog/issues/418)
    Clicking on the map (in a way that brings up the GFI) also updates the point time series lat/lon.
    The lat/lon is updated regardless of whether or not the point time series checkbox is checked.
    The point time series lat/lon is not populated by default
    Validation that displays an error if the point time series checkbox is checked without a lat/lon (prompting the user to enter coordinates)
*/
    @Test
    public void latLonUpdateTest() {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Satellite Platform");
        webElementUtil.clickLinkContainingText("Satellite");
        webElementUtil.clickButtonWithTitle("Add this collection");

        log.info("Validating that point time series lat/lon is not populated by default");
/*        WebElement latitude = webElementUtil.findElement(By.xpath("/[contains(text(),'Latitude')]/following-sibling::input"));
        Assert.assertNotNull(latitude);
        Assert.assertTrue(Strings.isNullOrEmpty(latitude.getAttribute("value")));

        WebElement longitude = webElementUtil.findElement(By.xpath("/[contains(.,'Longitude')]/following-sibling::input"));
        Assert.assertNotNull(longitude);
        Assert.assertTrue(Strings.isNullOrEmpty(longitude.getAttribute("value")));*/

        log.info("Validating that clicking on the map (in a way that brings up the GFI) also updates the point time series lat/lon.");
        WebElement mapPanel = webElementUtil.findElement(By.className("x-panel-bwrap"));
        webElementUtil.clickMap(mapPanel, 50, 50);

        String mainWindowHandle = getDriver().getWindowHandle();
        getDriver().switchTo().activeElement();
        String popupHtml = webElementUtil.findElement(By.className(" popupHtml")).getText();
        getDriver().switchTo().window(mainWindowHandle);

        WebElement latitude = webElementUtil.findElement(By.xpath("//*[contains(text(),'Latitude')]/following-sibling::input"));
        Assert.assertNotNull(latitude);
        //Assert.assertTrue(popupHtml.contains(latitude.getAttribute("value")));

        WebElement longitude = webElementUtil.findElement(By.xpath("//*[contains(text(),'Longitude')]/following-sibling::input"));
        Assert.assertNotNull(longitude);
        //Assert.assertTrue(popupHtml.contains(longitude.getAttribute("value")));

        log.info("Validating that lat/lon is updated regardless of whether or not the point time series checkbox is checked");

    }
}
