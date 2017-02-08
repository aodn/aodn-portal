package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import java.util.ArrayList;
import java.util.List;

public class FacetTest extends BaseTest {

    private static Logger log = Logger.getLogger(FacetTest.class.getName());

    @Test
    public void parameterPhysicalWaterTest() throws InterruptedException {
        String firstLevelFacet = "Physical-Water";
        verifyFacetResults(firstLevelFacet, "Temperature");
        verifyFacetResults(firstLevelFacet, "Salinity");
        verifyFacetResults(firstLevelFacet, "Current");
        verifyFacetResults(firstLevelFacet, "Water pressure");
        verifyFacetResults(firstLevelFacet, "Optical properties");
        verifyFacetResults(firstLevelFacet, "Turbidity");
        verifyFacetResults(firstLevelFacet, "Air-Sea Fluxes");
        verifyFacetResults(firstLevelFacet, "Wave");
        verifyFacetResults(firstLevelFacet, "Density");
        verifyFacetResults(firstLevelFacet, "Acoustics");
        verifyFacetResults(firstLevelFacet, "Sea surface height");
        verifyFacetResults(firstLevelFacet, "Depth");
        verifyFacetResults(firstLevelFacet, "Backscattering");
    }

    @Test
    public void parameterBiologicalTest() throws InterruptedException {
        String firstLevelFacet = "Biological";
        verifyFacetResults(firstLevelFacet, "Chlorophyll");
        verifyFacetResults(firstLevelFacet, "Ocean Biota");
        verifyFacetResults(firstLevelFacet, "Nutrient");
        verifyFacetResults(firstLevelFacet, "Pigment");
        verifyFacetResults(firstLevelFacet, "Suspended particulate material");
    }

    @Test
    public void parameterChemicalTest() throws InterruptedException {
        String firstLevelFacet = "Chemical";
        verifyFacetResults(firstLevelFacet, "Oxygen");
        verifyFacetResults(firstLevelFacet, "Carbon");
        verifyFacetResults(firstLevelFacet, "Alkalinity");
    }

    @Test
    public void parameterPhysicalAtmosphereTest() throws InterruptedException {
        String firstLevelFacet = "Physical-Atmosphere";
        verifyFacetResults(firstLevelFacet, "Air pressure");
        verifyFacetResults(firstLevelFacet, "Wind");
        verifyFacetResults(firstLevelFacet, "Air temperature");
        verifyFacetResults(firstLevelFacet, "Humidity");
        verifyFacetResults(firstLevelFacet, "Precipitation and evaporation");
        verifyFacetResults(firstLevelFacet, "Air-Sea Fluxes");
        verifyFacetResults(firstLevelFacet, "UV radiation");
    }

    @Test
    public void organisationTest() throws InterruptedException {
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);


        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = filterPanels.get(1);

        //open up the organisations panel, since it starts closed
        panel.click();

        List<WebElement> orgs = panel.findElements(By.tagName("a"));

        //The orgs WebElements will go stale, so we keep a list of their names to use throughout the test
        List<String> orgNames = new ArrayList<String>();

        log.info("Getting Organisation names");
        for(WebElement org: orgs) {
            orgNames.add(org.getText());
        }

        for(String orgName: orgNames) {
           verifyOrganisation(orgName);
        }
    }

    private void verifyOrganisation(String orgName) {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        List<WebElement> filterPanels = webElementUtil.findElements(By.className("search-filter-panel"));
        WebElement panel = filterPanels.get(1);

        //open up the organisations panel, since it starts closed
        panel.click();

        portalUtil.selectFacet(orgName);

        //now convert to just the org name, without the number of results
        orgName = orgName.split(" \\(\\d{1,}\\)")[0];
        log.info("Checking Organisation:" + orgName);
        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            WebElement facetResult = result.findElement(By.xpath("div[2]/span[2]"));
            Assert.assertTrue(facetResult.getText().contains(orgName));
        }
    }

    private void verifyFacetResults(String firstLevelFacet, String secondLevelFacet) {
        log.info("Loading search page - Step 1");
        getDriver().get(AODN_PORTAL_SEARCH_PAGE);

        portalUtil.selectFacet(firstLevelFacet);
        portalUtil.selectFacet(secondLevelFacet);

        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            WebElement facetResult = result.findElement(By.xpath("div[1]/span[2]"));
            Assert.assertTrue(facetResult.getText().contains(secondLevelFacet));
        }
    }
}
