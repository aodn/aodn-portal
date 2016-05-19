package au.org.emii.portal.tests;

import au.org.emii.portal.utils.WebElementUtil;
import org.junit.Assert;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class BrowserStack extends BaseTest {

    @Test(invocationCount = invocationCount, threadPoolSize = threadPoolSize)
    public void BrowserStackTest() {
        //Verify page title
        driver.get(AODN_PORTAL);
        WebElementUtil.verifyPageTitle("Open Access to Ocean Data", driver);

        //Verify potal link is working
        
        WebElement portalLink = driver.findElement(By.xpath("//*[@id=\"home\"]/div/div/div/a"));
        portalLink.click();
        WebElement dataCollectionTextElement = driver.findElement(By.xpath("//*[@id=\"viewPortTab0\"]/button/h2"));
        Assert.assertTrue(dataCollectionTextElement.getText().contains("Select a Data Collection"));


        //Verify IMOSOceanCurrent link is working
        driver.get(AODN_PORTAL);
        WebElement imosOceanCurrentLink = driver.findElement(By.xpath("//*[@id=\"information\"]/div/div/div[2]/div/a"));
        imosOceanCurrentLink.click();
        WebElementUtil.verifyPageTitle("IMOS-OceanCurrent", driver);
    }
}