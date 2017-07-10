package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

public class FacetParameterNewSearchTest extends BaseTest {

    @Test
    public void parameterNewSearchTest() throws InterruptedException {
        // Select parameter Physical-Atmosphere->Air pressure
        String firstLevelFacet = "Physical-Atmosphere";
        String secondLevelFacet = "Air pressure";
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, secondLevelFacet);

        // Click new search
        webElementUtil.clickLinkContainingText("New Search", true);
        webElementUtil.waitForInvisibilityOfElement(By.xpath(String.format("//a[contains(., '%s')]/preceding-sibling::input", firstLevelFacet)));

        //Check if non "Air pressure" collections are present
        boolean nonAirPressureCollectionPresent = false;
        List<WebElement> results = webElementUtil.findElements(By.className("resultsTextBody"));
        for (WebElement result : results) {
            WebElement facetResult = result.findElement(By.xpath("div[1]/span[2]"));
            if (!facetResult.getText().contains(secondLevelFacet)) {
                nonAirPressureCollectionPresent = true;
                break;
            }
        }
        Assert.assertTrue(nonAirPressureCollectionPresent, "Collection list not updated after removing facet collection");
    }
}
