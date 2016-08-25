package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class ImosLinkTest extends BaseTest {

    @Test
    public void linkTest() {
        webElementUtil.clickLinkWithTitle("Integrated Marine Observing System");
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Introducing IMOS: IMOS.org.au");
    }
}
