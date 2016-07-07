package au.org.emii.portal.tests;

import au.org.emii.portal.utils.SeleniumUtil;
import au.org.emii.portal.utils.WebElementUtil;
import org.apache.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

//Link to IMOS website
public class ImosLinkCheckTest extends BaseTest {

    private static Logger log = Logger.getLogger(ImosLinkCheckTest.class.getName());

    //Click on the IMOS link at the top right of the screen (22/08 now at bottom of screen)
    @Test(invocationCount = invocationCount, threadPoolSize = threadPoolSize)
    public void ImosLinkCheckTest() {
        // Go to home page
        getDriver().get(AODN_PORTAL_HOME_PAGE);
        int invalidLinksCountHomePage = SeleniumUtil.validateInvalidLinks(getDriver());
        Assert.assertEquals(invalidLinksCountHomePage, 0);

        // Go to search page - Step 1
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);
        wait(2);
        int invalidLinksCountSearchPageStep1 = SeleniumUtil.validateInvalidLinks(getDriver());
        Assert.assertEquals(invalidLinksCountSearchPageStep1, 0);

        // Go to search page - Step 2
        WebElementUtil.clickButtonWithTitle("Add this collection", getDriver());
        int invalidLinksCountSearchPageStep2 = SeleniumUtil.validateInvalidLinks(getDriver());
        Assert.assertEquals(invalidLinksCountSearchPageStep2, 0);

        // Go to search page - Step 3
        WebElementUtil.clickButtonWithText("Next", getDriver());
        int invalidLinksCountSearchPageStep3 = SeleniumUtil.validateInvalidLinks(getDriver());
        Assert.assertEquals(invalidLinksCountSearchPageStep3, 0);
    }
}
