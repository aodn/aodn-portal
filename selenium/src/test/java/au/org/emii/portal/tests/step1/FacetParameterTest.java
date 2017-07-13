package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.testng.annotations.Test;

public class FacetParameterTest extends BaseTest {

    @Test
    public void parameterPhysicalWaterTest() throws InterruptedException {
        String firstLevelFacet = "Physical-Water";
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Temperature");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Salinity");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Current");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Water pressure");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Optical properties");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Turbidity");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Air-Sea Fluxes");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Wave");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Density");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Acoustics");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Sea surface height");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Depth");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Backscattering");
    }

    @Test
    public void parameterBiologicalTest() throws InterruptedException {
        String firstLevelFacet = "Biological";
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Chlorophyll");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Ocean Biota");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Nutrient");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Pigment");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Suspended particulate material");
    }

    @Test
    public void parameterChemicalTest() throws InterruptedException {
        String firstLevelFacet = "Chemical";
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Oxygen");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Carbon");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Alkalinity");
    }

    @Test
    public void parameterPhysicalAtmosphereTest() throws InterruptedException {
        String firstLevelFacet = "Physical-Atmosphere";
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Air pressure");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Wind");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Air temperature");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Humidity");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Precipitation and evaporation");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "Air-Sea Fluxes");
        portalUtil.verifyFacetResults(getDriver(), firstLevelFacet, "UV radiation");
    }
}
