package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class PortalTest extends BaseTest {

    @Test
    public void stepTest() {
        webElementUtil.clickLinkContainingText("Get Ocean Data Now");

        // Step 1
        webElementUtil.verifyPageTitle("Open Access to Ocean Data");
        webElementUtil.verifyInnerHtml("<span class=\"stepTitle\">Step 1:</span> Select a Data Collection");
        portalUtil.selectFacet("Mooring and buoy");
        webElementUtil.clickButtonWithTitle("Add this collection");

        // Step 2
        webElementUtil.verifyInnerHtml("<span class=\"stepTitle\">Step 2:</span> Create a Subset");
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        webElementUtil.verifyInnerHtml("The full data collection will be downloaded. Consider filtering the collection.");
    }
}
