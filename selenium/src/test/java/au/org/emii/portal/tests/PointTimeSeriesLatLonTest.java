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
        WebElement latitudeTextBox = webElementUtil.findElement(By.xpath("//label[text()='Latitude']/following-sibling::input"));
        Assert.assertNotNull(latitudeTextBox);
        Assert.assertTrue("enter".equalsIgnoreCase(latitudeTextBox.getAttribute("value")));
		//click on it so the people watching at home can see (BrowserStack recording)
        latitudeTextBox.click();

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
        String[] parts = popupHtml.split(" ");


        getDriver().switchTo().window(mainWindowHandle);

        WebElement latitudeTextBox = webElementUtil.findElement(By.xpath("//label[text()='Latitude']/following-sibling::input"));
        Assert.assertNotNull(latitudeTextBox);
        double lat =  Double.parseDouble(latitudeTextBox.getAttribute("value"));
        double featureInfoLatitude = Double.parseDouble(parts[1]);
        double latDifference = lat - featureInfoLatitude;
        Assert.assertTrue(latDifference > -0.1 && latDifference < 0.1);

        WebElement longitudeTextBox = webElementUtil.findElement(By.xpath("//label[text()='Longitude']/following-sibling::input"));
        Assert.assertNotNull(longitudeTextBox);
        double lon =  Double.parseDouble(longitudeTextBox.getAttribute("value"));
        double featureInfoLongitude = Double.parseDouble(parts[3]);
        double lonDifference = lon - featureInfoLongitude;
        Assert.assertTrue(lonDifference > -0.1 && lonDifference < 0.1);

        Assert.assertEquals(parts[5].charAt(parts[5].length()-1), 'm',"Depth/Elevation doesn't have 'm' as unit");
        //make sure the depth can be parsed as a double
        Double.parseDouble(parts[5].substring(0,parts[5].length()-1));

    }
}
