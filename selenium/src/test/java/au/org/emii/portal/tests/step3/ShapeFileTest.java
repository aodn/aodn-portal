package au.org.emii.portal.tests.step3;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

public class ShapeFileTest extends BaseTest {

    private static Logger log = Logger.getLogger(ShapeFileTest.class.getName());

    @Test
    public void verifyShapeFile() {
        getDriver().get(AODN_PORTAL_SEARCH_PAGE + "?uuid=9d6b28d2-2d6b-4726-b603-ab03e3d15d34");

       List<WebElement> buttons = webElementUtil.findElements(By.className("viewPortButton"));

       buttons.get(2).click();

       webElementUtil.clickButtonWithText(" Download as… ");
       WebElement shapefileItem = webElementUtil.findElement(By.xpath("//span[contains(.,'Shapefile')]"));

       Assert.assertNotNull(shapefileItem, "Shapefile download option not displayed:");
    }
}
