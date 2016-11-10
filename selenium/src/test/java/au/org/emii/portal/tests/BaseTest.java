package au.org.emii.portal.tests;

import au.org.emii.portal.utils.PortalUtil;
import au.org.emii.portal.utils.SeleniumUtil;
import au.org.emii.portal.utils.WebElementUtil;
import org.apache.log4j.Logger;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Parameters;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

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
    public WebElementUtil webElementUtil;
    public SeleniumUtil seleniumUtil;
    protected PortalUtil portalUtil;

    private static Logger log = Logger.getLogger(BaseTest.class.getName());

    private WebDriver driver;

    static {
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
    }

    @Parameters({"browser", "browser_version", "os", "os_version", "device", "platform", "resolution"})
    @BeforeClass
    public void setup(String browser, String browser_version, String os, String os_version, String device, String platform, String resolution) throws MalformedURLException, InterruptedException {
        log.debug("browser: " + browser);
        log.debug("browser_version: " + browser_version);
        log.debug("os: " + os);
        log.debug("os_version: " + os_version);
        log.debug("device: " + device);
        log.debug("platform: " + platform);
        log.debug("resolution: " + resolution);
        log.debug(getClass().getSimpleName());

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

        webElementUtil = new WebElementUtil(driver);
        seleniumUtil = new SeleniumUtil(driver);
        portalUtil = new PortalUtil(webElementUtil);

        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        driver.manage().window().setPosition(new Point(0,0));
        driver.manage().window().setSize(new Dimension(getWidth(resolution),getHeight(resolution)));
        goToHome();
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }

    public DesiredCapabilities getDesiredCapability(String browser, String browser_version, String os, String os_version, String device, String platform, String resolution) {
        String name = getClass().getSimpleName();
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

    public void goToHome() {
        driver.get(AODN_PORTAL_HOME_PAGE);
    }

    public void goToSearchPage() {
        driver.get(AODN_PORTAL_SEARCH_PAGE);
    }

    private int getWidth(String resolution) {
        return Integer.parseInt(resolution.split("x")[0]);
    }

    private int getHeight(String resolution) {
        return Integer.parseInt(resolution.split("x")[0]);
    }

}

