package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class DisclaimerLinkTest extends BaseTest {

    @Test(groups = { "SkipTest"})
    public void linkTest() {
        webElementUtil.clickLinkContainingText("Disclaimer");
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Disclaimer | Portal User Guide");
        webElementUtil.verifyInnerHtml("<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</p>");
    }
}
