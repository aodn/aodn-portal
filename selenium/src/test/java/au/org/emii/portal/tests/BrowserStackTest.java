package au.org.emii.portal.tests;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class BrowserStackTest extends BaseTest {

    private static Logger log = Logger.getLogger(ImosLinkCheckTest.class.getName());

    @Test(invocationCount = invocationCount, threadPoolSize = threadPoolSize)
    public void sampleBrowserStackTest() {
        getDriver().get("http://www.google.com");
        WebElement element = getDriver().findElement(By.name("q"));

        element.sendKeys("sampleBrowserStackTest");
        element.submit();
        log.info(getDriver().getTitle());
    }
}
