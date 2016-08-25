package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

import java.util.ArrayList;

public class AcknowledgementTest extends BaseTest {

    @Test
    public void linkTest() {
        webElementUtil.clickLinkContainingText("Acknowledgement");
        webElementUtil.switchToNewTab();
        webElementUtil.verifyPageTitle("Data Use Acknowledgement | Portal User Guide");
        webElementUtil.verifyInnerHtml("<h2>Data Licencing</h2>");
     }
}
