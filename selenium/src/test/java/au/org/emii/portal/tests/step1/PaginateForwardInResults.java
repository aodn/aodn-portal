package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PaginateForwardInResults extends BaseTest {

    private static Logger log = Logger.getLogger(PaginateForwardInResults.class.getName());

    @Test
    public void paginationTest() throws InterruptedException {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        WebElement dataCollection = webElementUtil.findElement(By.xpath("//div[@class=\"resultsRowHeaderTitle\"][1]/h3"));
        String firstDataCollectionText = dataCollection.getText();

        // Go to page 2
        WebElement pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("1"));
        pageNumberInputBox.clear();
        pageNumberInputBox.sendKeys("2");
        pageNumberInputBox.sendKeys(Keys.RETURN);

        portalUtil.waitForSearchPanelReload(firstDataCollectionText);
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("2"));

        dataCollection = webElementUtil.findElement(By.xpath("//div[@class=\"resultsRowHeaderTitle\"][1]/h3"));
        String secondDataCollectionText = dataCollection.getText();
        Assert.assertFalse(secondDataCollectionText.equals(firstDataCollectionText));

        // Go to page 1
        webElementUtil.clickButtonWithClass("x-tbar-page-first");
        portalUtil.waitForSearchPanelReload(secondDataCollectionText);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("1"));

        // Go to next page
        webElementUtil.clickButtonWithClass("x-tbar-page-next");
        portalUtil.waitForSearchPanelReload(firstDataCollectionText);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("2"));

        // Go to last page
        webElementUtil.clickButtonWithClass("x-tbar-page-last");
        portalUtil.waitForSearchPanelReload(secondDataCollectionText);

        WebElement lastPage = webElementUtil.findElement(By.xpath("//div[@class='xtb-text' and contains(.,'of ')]"));
        String lastPageNumber = lastPage.getText().substring(3);
        log.info(String.format("Last Page Number %s", lastPageNumber));
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals(lastPageNumber));
    }
}
