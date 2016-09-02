package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ContactLinkTest extends BaseTest {

    private static Logger log = Logger.getLogger(ContactLinkTest.class.getName());

    @Test
    public void linkTest() {
        goToHome();
        WebElement contact = webElementUtil.findElement(By.linkText("Contact"));
        Assert.assertNotNull(contact);
        webElementUtil.clickLinkContainingText("Get Ocean Data Now");

        // Step 1
        contact = webElementUtil.findElement(By.linkText("Contact"));
        Assert.assertNotNull(contact);
        webElementUtil.clickButtonWithTitle("Add this collection");

        // Step 2
        contact = webElementUtil.findElement(By.linkText("Contact"));
        Assert.assertNotNull(contact);
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        contact = webElementUtil.findElement(By.linkText("Contact"));
        Assert.assertNotNull(contact);
    }
}
