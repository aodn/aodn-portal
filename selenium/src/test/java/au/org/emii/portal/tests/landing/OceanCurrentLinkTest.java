package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class OceanCurrentLinkTest extends BaseTest {

    @Test
    public void linkTest() {
        webElementUtil.clickLinkContainingText("IMOS OceanCurrent");
        webElementUtil.verifyPageTitle("IMOS-OceanCurrent");
    }
}
