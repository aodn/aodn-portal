package au.org.emii.portal.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class BrowserStackTest extends BaseTest {

    @Test(invocationCount = invocationCount, threadPoolSize = threadPoolSize)
    public void BrowserStackTest() {
        getDriver().get("http://www.google.com");
        WebElement element = getDriver().findElement(By.name("q"));

        element.sendKeys("BrowserStackTest");
        element.submit();
        wait(5);
        System.out.println(getDriver().getTitle());
    }
}
