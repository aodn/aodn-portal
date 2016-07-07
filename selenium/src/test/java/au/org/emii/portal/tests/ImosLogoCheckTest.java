package au.org.emii.portal.tests;

import au.org.emii.portal.utils.SeleniumUtil;
import au.org.emii.portal.utils.WebElementUtil;
import org.apache.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

//IMOS Logo should be present
public class ImosLogoCheckTest extends BaseTest {

    private static Logger log = Logger.getLogger(ImosLogoCheckTest.class.getName());

    //Look at logo in top right corner of any step including landing page
    @Test(invocationCount = invocationCount, threadPoolSize = threadPoolSize)
    public void ImosLogoCheckTest() {
        // Go to home page
        getDriver().get(AODN_PORTAL_HOME_PAGE);
        int invalidImageCountHomePage = SeleniumUtil.validateInvalidImages(getDriver());
        Assert.assertEquals(invalidImageCountHomePage, 0);

        // Go to search page - Step 1
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);
        wait(2);
        int invalidImageCountSearchPageStep1 = SeleniumUtil.validateInvalidImages(getDriver());
        Assert.assertEquals(invalidImageCountSearchPageStep1, 0);

        // Go to search page - Step 2
        WebElementUtil.clickButtonWithTitle("Add this collection", getDriver());
        int invalidImageCountSearchPageStep2 = SeleniumUtil.validateInvalidImages(getDriver());
        Assert.assertEquals(invalidImageCountSearchPageStep2, 0);

        // Go to search page - Step 3
        WebElementUtil.clickButtonWithText("Next", getDriver());
        int invalidImageCountSearchPageStep3 = SeleniumUtil.validateInvalidImages(getDriver());
        Assert.assertEquals(invalidImageCountSearchPageStep3, 0);
    }
}
