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

import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class FreeTextSearchTest extends BaseTest {

    private static Logger log = Logger.getLogger(FreeTextSearchTest.class.getName());

    public static Map<String, String> getQueryMap(String query)
    {
        String[] params = query.split("&");
        Map<String, String> map = new HashMap<String, String>();
        for (String param : params)
        {
            String name = param.split("=")[0];
            String value = param.split("=")[1];
            map.put(name, value);
        }
        return map;
    }


    @Test(groups = { "SkipFirefox"})
    public void freeTextSearchTest() {
        String searchTerm = "CARS";

        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        WebElement stalenessCheck = driver.findElements(By.className("resultsHeaderBackground")).get(0);

        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = null;

        for(WebElement p : filterPanels) {
            if(p.getText().contains("Keyword")) {
                panel=p;
            }
        }

        WebElement searchInput = panel.findElement(By.tagName("input"));

        //enter the search term
        searchInput.sendKeys(searchTerm);
        searchInput.sendKeys(Keys.RETURN);

        //wait and get filtered results
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.stalenessOf(stalenessCheck));
        List<WebElement> panels = webElementUtil.findElements(By.className("resultsTextBody"));

        List<String> metadataUrls = new ArrayList<String>();

        //open new tabs for each metadata record
        for (WebElement resultPanel: panels) {

            try {
                String query = new URL(resultPanel.findElement(By.linkText("more")).getAttribute("href")).getQuery();
                Map<String, String> queryMap = getQueryMap(query);

                queryMap.get("uuid");
                String proxyUrl = URLEncoder.encode("http://catalogue-systest-internal.aodn.org.au/geonetwork/srv/eng/xml.metadata.get?uuid=" + queryMap.get("uuid"), "UTF-8");
                metadataUrls.add(AODN_PORTAL_PROXY_URL + "?url=" + proxyUrl);

            } catch (java.net.MalformedURLException | java.io.UnsupportedEncodingException e) {
                log.error(e.getMessage(), e);
            }
        }

        //open each metadata page in turn to check for search term
        for (String url : metadataUrls) {
            driver.get(url);

            Assert.assertTrue(driver.getPageSource().contains(searchTerm));
        }

        log.info("Validation Complete");
    }
}
