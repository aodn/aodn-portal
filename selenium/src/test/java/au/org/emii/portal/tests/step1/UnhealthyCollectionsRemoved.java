package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


public class UnhealthyCollectionsRemoved extends BaseTest {

    private static Logger log = Logger.getLogger(UnhealthyCollectionsRemoved.class.getName());

    private List<String> getUnhealthyCollectionIds(WebDriver driver) {

        List<String> uuidList = new ArrayList();

        List<WebElement> btns = driver.findElements(By.className("facetedSearchBtn"));
        Iterator<WebElement> iter = btns.iterator();

        while(iter.hasNext()) {
            WebElement btn = iter.next();
            String id = btn.getAttribute("id");
            uuidList.add(id.replace("fsSearchAddBtn-", ""));
        }

        return uuidList;
    }

    private WebElement getNewSearchInput(WebDriver driver) {
        driver.get(AODN_PORTAL_SEARCH_PAGE);


        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for(WebElement p : filterPanels) {
            if(p.getText().contains("Keyword")) {
                panel=p;
            }
        }

        return panel.findElement(By.tagName("input"));
    }


    @Test
    public void unhealthyCollectionsRemoved() {
        log.info("Loading search page - Step 1 (unhealthy collections)");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE + "?health=bad");

        List<String> unhealthy = getUnhealthyCollectionIds(driver);

        log.info(unhealthy);

        for (String uuid: unhealthy) {
            WebElement searchInput = getNewSearchInput(driver);

            //wait for result info dialog to appear
            WebElement stalenessCheck = driver.findElements(By.className("resultsHeaderBackground")).get(0);
            searchInput.sendKeys(uuid);
            searchInput.sendKeys(Keys.RETURN);

            WebDriverWait wait = new WebDriverWait(driver, 30);
            wait.until(ExpectedConditions.stalenessOf(stalenessCheck));

            Assert.assertTrue(driver.getPageSource().contains("The search returned no results"));
        }
    }
}


