package au.org.emii.portal.tests.landing;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class PortalTest extends BaseTest {

    @Test
    public void stepTest() {
        webElementUtil.clickLinkContainingText("Get Ocean Data Now");

        // Step 1
        webElementUtil.verifyPageTitle("Open Access to Ocean Data");
        webElementUtil.verifyTextPresentOnPage("Step 1: Select a Data Collection");

        portalUtil.selectFacet("Mooring and buoy");
        webElementUtil.clickButtonWithTitle("Add this collection");

        // Step 2
        webElementUtil.verifyTextPresentOnPage("Step 2: Create a Subset");
        webElementUtil.clickButtonWithText("Next");

        // Step 3
        webElementUtil.verifyTextPresentOnPage("Please consider filtering");
    }
}
