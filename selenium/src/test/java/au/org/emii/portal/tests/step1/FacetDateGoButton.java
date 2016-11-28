package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.concurrent.TimeUnit;

public class FacetDateGoButton extends BaseTest {

    private static Logger log = Logger.getLogger(FacetDateGoButton.class.getName());

    @Test
    public void goButtonTest() {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        log.info("Selecting Date Facet with 'Go' label");

        // Open the Date Facet
        String dateFacetXPath = "(//span[contains(.,'Date') and @class='filter-selection-panel-header']/ancestor::div[1])[1]";
        /*
        * didnt work !!
        * webElementUtil.clickElementByXpath(dateFacetXPath);
        */
        WebElement dateFacetHeader = webElementUtil.findElement(By.xpath(dateFacetXPath));
        dateFacetHeader.click();

        // stupid table wrapper of the Go button
        String goButtonXPath = dateFacetXPath + "/parent::div[1]/descendant::table[contains(.,'Go')]";
        WebElement goButtonTable = webElementUtil.findElement(By.xpath(goButtonXPath));
        Assert.assertTrue(goButtonTable.getAttribute("class").contains("x-item-disabled"));

        // make the Go button go
        webElementUtil.findElement(By.xpath("//input[@name='extFrom']")).sendKeys("2016-11-22");
        webElementUtil.findElement(By.xpath("//input[@name='extTo']")).sendKeys("2016-11-22");
        webElementUtil.click(goButtonTable);

        getDriver().manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        Assert.assertFalse(goButtonTable.getAttribute("class").contains("x-item-disabled"));

        log.info("Validation Complete");
    }
}