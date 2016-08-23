package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class ContributingLinkTest extends BaseTest {

    @Test
    public void linkTest() {
        webElementUtil.clickLinkContainingText("Contributing");
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Contributing Data | Portal User Guide");
    }
}
