package au.org.emii.portal.tests;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PointTimeSeriesLatLonTest extends BaseTest {

    private static Logger log = Logger.getLogger(PointTimeSeriesLatLonTest.class.getName());

    @Test
    public void latLonUpdateTest() {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Satellite Platform");
        portalUtil.selectFacet("Satellite");
        webElementUtil.clickButtonWithTitle("Add this collection");

        log.info("Validating that point time series lat/lon is not populated by default");
        WebElement latitude1 = webElementUtil.findElement(By.xpath("//label[text()='Latitude']/following-sibling::input"));
        Assert.assertNotNull(latitude1);
        Assert.assertTrue("enter".equalsIgnoreCase(latitude1.getAttribute("value")));

        WebElement longitude1 = webElementUtil.findElement(By.xpath("//label[text()='Longitude']/following-sibling::input"));
        Assert.assertNotNull(longitude1);
        Assert.assertTrue("enter".equalsIgnoreCase(longitude1.getAttribute("value")));

        validateLatLon(10, 50);
        webElementUtil.clickElementBy(By.xpath("//label[text()='Point timeseries']/preceding-sibling::input"));
        validateLatLon(50, 400);

        log.info("Validation Complete");
    }

    public void validateLatLon(int x, int y) {
        log.info("Validating that clicking on the map (in a way that brings up the GFI) also updates the point time series lat/lon.");
        WebElement mapPanel = webElementUtil.findElement(By.className("x-panel-bwrap"));
        Point location = mapPanel.getLocation();
        webElementUtil.clickElementAt(location.getX() + x, location.getY() + y);

        String mainWindowHandle = getDriver().getWindowHandle();
        getDriver().switchTo().activeElement();

        String popupHtml = webElementUtil.waitForElement(By.xpath("//div[contains(@class,'popupHtml') and contains(.,'Lat:')]")).getText();
        getDriver().switchTo().window(mainWindowHandle);

        WebElement latitude2 = webElementUtil.findElement(By.xpath("//label[text()='Latitude']/following-sibling::input"));
        Assert.assertNotNull(latitude2);
        String lat = latitude2.getAttribute("value");
        Assert.assertTrue(popupHtml.contains(lat));

        WebElement longitude2 = webElementUtil.findElement(By.xpath("//label[text()='Longitude']/following-sibling::input"));
        Assert.assertNotNull(longitude2);
        String lon = longitude2.getAttribute("value");
        Assert.assertTrue(popupHtml.contains(lon));
        log.info(String.format("X:%s, Y:%s, Lat:%s, Lon:%s", x, y, lat, lon));
    }
}
