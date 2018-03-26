package au.org.emii.portal.tests.step1;

import au.org.emii.portal.tests.BaseTest;
import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;


public class LogoTest extends BaseTest {

    private static Logger log = Logger.getLogger(LogoTest.class.getName());

    int MAX_DIMENSION = 50;
    Random random = new Random();

    @Test
    public void logoTest() {
        log.info("Loading search page - Step 1");
        WebDriver driver = getDriver();
        driver.get(AODN_PORTAL_SEARCH_PAGE);

        int NUM_PAGES_TO_TEST = 5;
        List imageInfoList = new ArrayList<Image>();

        Integer numPages = Integer.parseInt(
                webElementUtil.findElement(By.xpath("//div[@class='xtb-text' and contains(.,'of ')]")).getText().substring(3)
        );
        log.info("numPages: " + numPages);

        // list of page numbers to randomly test
        List<Integer> pageNumbers = generatePageList(NUM_PAGES_TO_TEST, 1, numPages);


        // switch to each page
        for(Integer pageNum: pageNumbers) {
            changeToPageWithNumber(pageNum);

            List<WebElement> resultsIconContainers = driver.findElements(By.className("resultsIconContainer"));

            // for each logo get attributes
            // - the style (in the DOM) for each img tag
            // - the height and width of the actual image resource
            for(WebElement result: resultsIconContainers) {
                WebElement imageElement = result.findElement(By.tagName("img"));

                String style = imageElement.getAttribute("style");
                String src = imageElement.getAttribute("src");

                HashMap attributes = getImageAttributes(src);
                attributes.put("style", style);
                imageInfoList.add(attributes);
            }
        }

        log.info("number of items collected for testing: " + imageInfoList.size());

        // perform assertions on each logo
        for (Object hmo: imageInfoList) {
            HashMap<String, String> imageAttributes = (HashMap) hmo;
            log.info("testing logo");
            log.info("  url: " + imageAttributes.get("url"));
            log.info("  height: " + imageAttributes.get("height"));
            log.info("  width: " + imageAttributes.get("width"));
            log.info("  style: " + imageAttributes.get("style"));

            // test max-width and max-height style properties
            testStyle(imageAttributes.get("style"));

            // test image width and height is minimum of 50px in either dimension
            Boolean heightOK = Integer.parseInt(imageAttributes.get("height")) >= this.MAX_DIMENSION;
            Boolean widthOK = Integer.parseInt(imageAttributes.get("width")) >= this.MAX_DIMENSION;

            // tests that either the width OR the height of the actual image is over MAX_DIMENSION
            Assert.assertTrue(heightOK || widthOK, "width or height undersize for image: " + imageAttributes.get("url"));
        }
    }

    private void testStyle(String style) {

        String[] styleItems = style.split("\\;");
        for (String item: styleItems) {

            String[] pair = item.split("\\:");
            String property = pair[0].replaceAll("\\s+","");
            String value = pair[1].replaceAll("\\s+","");
            String match = String.valueOf(this.MAX_DIMENSION) + "px";

            if (property.equals("max-height")) {
                Assert.assertTrue(
                        value.equals(match),
                        "max-height expected to be " + match
                );
            }
            else if (property.equals("max-width")) {
                Assert.assertTrue(
                        value.equals(match),
                        "max-width expected to be " + match
                );
            }
        }
    }

    // download each image from url and retrieve attributes
    private HashMap getImageAttributes(String url) {

        HashMap imageAttributes = new HashMap<String, String>();
        imageAttributes.put("url", url);

        try {
            BufferedImage image = ImageIO.read(new URL(url));
            imageAttributes.put("height", String.valueOf(image.getHeight()));
            imageAttributes.put("width", String.valueOf(image.getWidth()));
        } catch(java.io.IOException e) {
            log.info(e.getMessage());
        }

        return imageAttributes;
    }


    // change to given page in the portal
    private void changeToPageWithNumber(Integer targetPageNum) {

        log.info("changing to page: " + targetPageNum);

        WebElement dataCollection = webElementUtil.findElement(By.xpath("//div[@class=\"resultsRowHeaderTitle\"][1]/h3"));
        String firstDataCollectionText = dataCollection.getText();

        WebElement pageNumberInputBox = webElementUtil.findElement(By.className("x-tbar-page-number"));
        pageNumberInputBox.clear();
        pageNumberInputBox.sendKeys(targetPageNum.toString());
        pageNumberInputBox.sendKeys(Keys.RETURN);

        portalUtil.waitForSearchPanelReload(firstDataCollectionText);
    }


    // generate a random list of unique page numbers
    private List<Integer> generatePageList(int count, int min, int max) {

        List<Integer> ints = new ArrayList<Integer>();

        while (ints.size() < count) {
            int rand = this.random.nextInt(max - min + 1) + min;

            if (!ints.contains(rand)) {
                ints.add(rand);
            }
        }
        return ints;
    }
}
