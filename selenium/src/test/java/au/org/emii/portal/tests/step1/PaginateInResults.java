package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PaginateInResults extends BaseTest {

    private static Logger log = Logger.getLogger(PaginateInResults.class.getName());

    @Test
    public void paginationTest() throws InterruptedException {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        WebElement dataCollection = webElementUtil.findElement(By.xpath("//div[@class=\"resultsRowHeaderTitle\"][1]/h3"));
        String firstDataCollectionText = dataCollection.getText();

        // Go to page 2 by typing '2'
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

        // Go to page 1 by pressing 'first' button
        webElementUtil.clickButtonWithClass("fa-fast-backward");
        portalUtil.waitForSearchPanelReload(secondDataCollectionText);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("1"));

        // Go to page 2 by pressing 'next' button
        webElementUtil.clickButtonWithClass("fa-forward");
        portalUtil.waitForSearchPanelReload(firstDataCollectionText);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("2"));

        // Go to page 1 by pressing 'prev' button
        webElementUtil.clickButtonWithClass("fa-backward");
        portalUtil.waitForSearchPanelReload(secondDataCollectionText);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals("1"));

        // Go to last page by pressing 'last' button
        webElementUtil.clickButtonWithClass("fa-fast-forward");
        portalUtil.waitForSearchPanelReload(firstDataCollectionText);
        WebElement lastPage = webElementUtil.findElement(By.xpath("//div[@class='xtb-text' and contains(.,'of ')]"));
        String lastPageNumber = lastPage.getText().substring(3);
        pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        Assert.assertTrue(pageNumberInputBox.getAttribute("value").equals(lastPageNumber));
    }
}
