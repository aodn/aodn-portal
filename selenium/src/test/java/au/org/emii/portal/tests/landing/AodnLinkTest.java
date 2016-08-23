package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class AodnLinkTest extends BaseTest {

    @Test
    public void linkTest() {
        webElementUtil.clickLinkContainingText("AODN");
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Australian Ocean Data Network: IMOS.org.au");
    }
}
