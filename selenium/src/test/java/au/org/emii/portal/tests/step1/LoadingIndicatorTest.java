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
        WebDriver driver = getDriver();

        //reset implicit wait to 0 since this spinner is only available for a few seconds
        driver.manage().timeouts().implicitlyWait(0, TimeUnit.MILLISECONDS);
        FluentWait<WebDriver> wait = new FluentWait<WebDriver>(driver)
                .withTimeout(2000, TimeUnit.MILLISECONDS)
                .pollingEvery(200, TimeUnit.MILLISECONDS)
                .ignoring(NoSuchElementException.class)
                .ignoring(TimeoutException.class);

        driver.get(AODN_PORTAL_SEARCH_PAGE);
        WebElement filterPanel = webElementUtil.findElement(By.className("search-filter-panel"));

        List<WebElement> spinners = null;
        boolean passed = false;

        // the spinner only appears for a short time, and selenium sometimes misses it, so try repeatedly
        for(int i = 0;i<10;i++) {
            WebElement facet = filterPanel.findElement(By.tagName("a"));
            facet.click();

            //wait for spinner to become visible
            try {
                spinners = wait.until(
                        ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("fa-spinner")));
                passed=true;
                break;
            } catch (TimeoutException e) {}
        }
        Assert.assertTrue(passed,"Facet loading spinner never appeared");

        //make sure there's only one spinner
        Assert.assertEquals(spinners.size(), 1);

        wait = new WebDriverWait(driver, 30);
        //make sure the spinner disappears
        try {
            wait.until(ExpectedConditions.invisibilityOfAllElements(spinners));
        } catch (TimeoutException e) {
            Assert.fail("Facet loading spinner never disappeared");
        }
    }
}
