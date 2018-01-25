package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;


public class ClearFacetTest extends BaseTest {

    private static Logger log = Logger.getLogger(ClearFacetTest.class.getName());

    private int currentPageCount(WebDriver driver) {
        WebElement pageCountDiv = driver.findElement(By.xpath("//td[contains(@class, 'x-toolbar-cell') and contains(.//div, 'of ')]"));
        return Integer.parseInt(pageCountDiv.getText().replace("of ", ""));
    }

    @Test
    public void enterDateAndClear() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        int initialPageCount = currentPageCount(driver);
        log.info("initial page count: " + initialPageCount);

        portalUtil.selectFacetHeading("Date (UTC)");

        //enter From date
        WebElement fromDateInput = driver.findElement(By.xpath("//label[contains(text(), 'From')]"))
                .findElement(By.xpath("..")).findElement(By.tagName("input"));
        fromDateInput.sendKeys("1900-01-01");

        //enter To date
        WebElement toDateInput = driver.findElement(By.xpath("//label[contains(text(), 'To')]"))
                .findElement(By.xpath("..")).findElement(By.tagName("input"));
        toDateInput.sendKeys("1900-01-01");

        //click Go button
        webElementUtil.findElement(By.xpath("//button[contains(.,'Go')]")).click();

        int updatedPageCount = currentPageCount(driver);
        log.info("updated page count: " + updatedPageCount);

        //click Clear button
        webElementUtil.findElement(By.xpath("//button[contains(.,'Clear')]")).click();

        int finalPageCount = currentPageCount(driver);
        log.info("final page count: " + finalPageCount);

        Assert.assertTrue(initialPageCount != updatedPageCount, "page count changes after dates entered");
        Assert.assertTrue(finalPageCount == initialPageCount, "page count after clear is same as initial page count");
    }

    @Test
    public void drawMapAndClear() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        int initialPageCount = currentPageCount(driver);
        log.info("initial page count: " + initialPageCount);

        portalUtil.selectFacetHeading("Geographic Boundary");

        WebElement map = driver.findElement(By.className("olControlGeoFacetToolbarActive"));

        //draw a bounding box
        map.click();
        Actions actions = new Actions(driver);
        actions.moveToElement(map).moveByOffset(20,20).click().perform();
        actions.moveToElement(map).moveByOffset(60,20).click().perform();
        actions.moveToElement(map).moveByOffset(60,0).click().perform();
        actions.moveToElement(map).moveByOffset(60,0).click().perform();
        actions.click().doubleClick().build().perform();


        //click the go button
        List<WebElement> buttons = driver.findElement(By.className("geoSelectionPanelbuttons"))
                                    .findElements(By.className("x-btn-text"));
        buttons.get(0).click();

        int updatedPageCount = currentPageCount(driver);
        log.info("updated page count: " + updatedPageCount);

        //click the clear button
        buttons.get(1).click();

        int finalPageCount = currentPageCount(driver);
        log.info("final page count: " + finalPageCount);

        Assert.assertTrue(initialPageCount != updatedPageCount, "page count changes after map drawn");
        Assert.assertTrue(finalPageCount == initialPageCount, "page count after clear is same as initial page count");

        log.info("Validation Complete");
    }
}
