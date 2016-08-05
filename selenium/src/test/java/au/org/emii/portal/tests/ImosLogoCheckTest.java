package au.org.emii.portal.tests;

import org.apache.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

//IMOS Logo should be present
public class ImosLogoCheckTest extends BaseTest {

    private static Logger log = Logger.getLogger(ImosLogoCheckTest.class.getName());

    //Look at logo in top right corner of any step including landing page
    @Test
    public void verifyLogoTest() {
        // Go to home page
        getDriver().get(AODN_PORTAL_HOME_PAGE);
        int invalidImageCountHomePage = seleniumUtil.validateInvalidImages();
        Assert.assertEquals(invalidImageCountHomePage, 0);

        // Go to search page - Step 1
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);
        int invalidImageCountSearchPageStep1 = seleniumUtil.validateInvalidImages();
        Assert.assertEquals(invalidImageCountSearchPageStep1, 0);

        // Go to search page - Step 2
        webElementUtil.clickButtonWithTitle("Add this collection");
        int invalidImageCountSearchPageStep2 = seleniumUtil.validateInvalidImages();
        Assert.assertEquals(invalidImageCountSearchPageStep2, 0);

        // Go to search page - Step 3
        webElementUtil.clickButtonWithText("Next");
        int invalidImageCountSearchPageStep3 = seleniumUtil.validateInvalidImages();
        Assert.assertEquals(invalidImageCountSearchPageStep3, 0);
    }
}
