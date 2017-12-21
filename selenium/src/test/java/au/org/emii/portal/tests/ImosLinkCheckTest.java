package au.org.emii.portal.tests;

import org.apache.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

//Link to IMOS website
public class ImosLinkCheckTest extends BaseTest {

    private static Logger log = Logger.getLogger(ImosLinkCheckTest.class.getName());

    //Click on the IMOS link at the top right of the screen (22/08 now at bottom of screen)
    @Test
    public void verifyLinkTest() {
        // Go to home page
        getDriver().get(AODN_PORTAL_HOME_PAGE);
        int invalidLinksCountHomePage = seleniumUtil.validateUrlLinks();
        Assert.assertEquals(invalidLinksCountHomePage, 0);

        // Go to search page - Step 1
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);
        portalUtil.waitUntilLoadingComplete();
        int invalidLinksCountSearchPageStep1 = seleniumUtil.validateUrlLinks();
        Assert.assertEquals(invalidLinksCountSearchPageStep1, 0);

        // Go to search page - Step 2
        webElementUtil.clickButtonWithTitle("Add this collection");
        portalUtil.waitUntilLoadingComplete();
        int invalidLinksCountSearchPageStep2 = seleniumUtil.validateUrlLinks();
        Assert.assertEquals(invalidLinksCountSearchPageStep2, 0);

        // Go to search page - Step 3
        webElementUtil.clickButtonWithText("Next");
        portalUtil.waitUntilLoadingComplete();
        int invalidLinksCountSearchPageStep3 = seleniumUtil.validateUrlLinks();
        Assert.assertEquals(invalidLinksCountSearchPageStep3, 0);
    }
}
