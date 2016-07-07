package au.org.emii.portal.tests;


import org.apache.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Parameters;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;

public class BaseTest {
    public static String BROWSER_STACK_USERNAME;
    public static String BROWSER_STACK_AUTOMATE_KEY;
    public static String BROWSER_STACK_URL;
    public static String BROWSER_STACK_LOCAL_URL;

    public static String BROWSER_STACK_DEBUG;
    public static String BROWSER_STACK_LOCAL;
    public static String BROWSER_STACK_VIDEO;
    public static String BROWSER_STACK_BUILD;

    public static String AODN_PORTAL_HOME_PAGE;
    public static String AODN_PORTAL_SEARCH_PAGE;

    public static final int invocationCount = 1;
    public static final int threadPoolSize = 1;

    public static Properties properties = new Properties();
    private static Logger log = Logger.getLogger(BaseTest.class.getName());

    private WebDriver driver;

    @Parameters({"browser", "browser_version", "os", "os_version", "device", "platform", "resolution"})
    @BeforeClass
    public void setup(String browser, String browser_version, String os, String os_version, String device, String platform, String resolution) throws MalformedURLException, InterruptedException {

        BROWSER_STACK_AUTOMATE_KEY = System.getProperty("browserstack.automateKey");
        BROWSER_STACK_USERNAME = System.getProperty("browserstack.username");
        BROWSER_STACK_DEBUG = System.getProperty("browserstack.debug");
        BROWSER_STACK_VIDEO = System.getProperty("browserstack.video");
        BROWSER_STACK_BUILD = System.getProperty("build");
        BROWSER_STACK_LOCAL = System.getProperty("browserstack.local");

        log.debug("BROWSER_STACK_AUTOMATE_KEY: " + BROWSER_STACK_AUTOMATE_KEY);
        log.debug("BROWSER_STACK_USERNAME: " + BROWSER_STACK_USERNAME);
        log.debug("BROWSER_STACK_DEBUG: " + BROWSER_STACK_DEBUG);
        log.debug("BROWSER_STACK_VIDEO: " + BROWSER_STACK_VIDEO);
        log.debug("BROWSER_STACK_BUILD: " + BROWSER_STACK_BUILD);
        log.debug("BROWSER_STACK_LOCAL: " + BROWSER_STACK_LOCAL);

        BROWSER_STACK_URL = "https://" + BROWSER_STACK_USERNAME + ":" + BROWSER_STACK_AUTOMATE_KEY + "@hub-cloud.browserstack.com/wd/hub";
        BROWSER_STACK_LOCAL_URL = "https://" + BROWSER_STACK_USERNAME + ":" + BROWSER_STACK_AUTOMATE_KEY + "@hub.browserstack.com/wd/hub";

        AODN_PORTAL_HOME_PAGE = System.getProperty("aodnPortal");
        AODN_PORTAL_SEARCH_PAGE = AODN_PORTAL_HOME_PAGE + System.getProperty("aodnPortalSearch");

        DesiredCapabilities capability = getDesiredCapability(browser, browser_version, os, os_version, device, platform, resolution);

        if (BROWSER_STACK_LOCAL.equals("true")) {
            driver = new RemoteWebDriver(new URL(BROWSER_STACK_LOCAL_URL), capability);
        } else {
            driver = new RemoteWebDriver(new URL(BROWSER_STACK_URL), capability);
        }

        driver.get(AODN_PORTAL_HOME_PAGE);
        wait(5);
    }

    @org.testng.annotations.AfterClass
    public void tearDown() {
        driver.quit();
    }

    public DesiredCapabilities getDesiredCapability(String browser, String browser_version, String os, String os_version, String device, String platform, String resolution) {
        String name = browser + " " + browser_version + " " + os + " " + os_version + " " + device;
        DesiredCapabilities capability = new DesiredCapabilities();

        capability.setCapability("browser", browser);
        capability.setCapability("browser_version", browser_version);
        capability.setCapability("os", os);
        capability.setCapability("os_version", os_version);
        capability.setCapability("device", device);
        capability.setCapability("platform", platform);
        capability.setCapability("resolution", resolution);
        capability.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true);
        capability.setCapability("name", name);
        capability.setCapability("browserstack.local", BROWSER_STACK_LOCAL);
        capability.setCapability("browserstack.debug", BROWSER_STACK_DEBUG);
        capability.setCapability("browserstack.video", BROWSER_STACK_VIDEO);
        capability.setCapability("build", BROWSER_STACK_BUILD);
        return capability;
    }

    public WebDriver getDriver() {
        return driver;
    }

    public boolean isElementClickable(By locator) {
        WebElement element = driver.findElement(locator);
        return (element != null && element.isDisplayed() && element.isEnabled()) ? true : false;
    }

    public void acceptAlert() {
        // Check the presence of alert
        Alert alert = driver.switchTo().alert();
        // if present consume the alert
        alert.accept();
    }

    public void cancelAlert() {
        // Check the presence of alert
        Alert alert = driver.switchTo().alert();
        // if present consume the alert
        alert.dismiss();
    }

    public void wait(int seconds) {
        try {
            Thread.sleep(1000 * seconds);
        } catch (InterruptedException e) {
            log.error("Unable to wait", e);
        }
    }
}

