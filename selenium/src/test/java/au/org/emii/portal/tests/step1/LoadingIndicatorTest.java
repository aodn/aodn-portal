package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class LoadingIndicatorTest extends BaseTest {

    private static Logger log = Logger.getLogger(LoadingIndicatorTest.class.getName());

    @Test
    public void loadingIndicatorTest() throws InterruptedException {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        WebElement filterPanel = webElementUtil.findElement(By.className("search-filter-panel"));
        WebElement facet = webElementUtil.findNestedElement(filterPanel, By.tagName("a"));
        facet.click();

        //make sure the spinner appears
        webElementUtil.findElement(By.className("fa-spinner"), 100, TimeUnit.MILLISECONDS);

        //make sure the spinner disappears
        webElementUtil.waitForInvisibilityOfElement(By.className("fa-spinner"));

        log.info("Validation Complete");
    }
}
