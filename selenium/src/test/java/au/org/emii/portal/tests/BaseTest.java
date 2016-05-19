package au.org.emii.portal.tests;


import org.apache.log4j.Logger;
import org.openqa.selenium.*;
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

    public static String BROWSER_STACK_DEBUG;
    public static String BROWSER_STACK_LOCAL;

    public static String AODN_PORTAL;

    public static final int invocationCount = 1;
    public static final int threadPoolSize = 1;

    public static Properties properties = new Properties();
    private static Logger log = Logger.getLogger(BaseTest.class.getName());

    protected WebDriver driver;

    @Parameters({"browser", "browser_version", "os", "os_version", "device", "resolution"})
    @BeforeClass
    public void setup(String browser, String browser_version, String os, String os_version, String device, String resolution) throws MalformedURLException, InterruptedException {
        InputStream inputStream = null;

        org.apache.log4j.BasicConfigurator.configure();
        String propFileName = "config.properties";
        try {
            inputStream = BaseTest.class.getClassLoader().getResourceAsStream(propFileName);
            properties.load(inputStream);
        } catch (IOException e) {
            log.error("property file '" + propFileName + "' not found in the classpath");
        }

        BROWSER_STACK_USERNAME = properties.getProperty("browserstack.username");
        BROWSER_STACK_AUTOMATE_KEY = properties.getProperty("browserstack.automateKey");
        BROWSER_STACK_URL = "https://" + BROWSER_STACK_USERNAME + ":" + BROWSER_STACK_AUTOMATE_KEY + "@hub.browserstack.com/wd/hub";

        BROWSER_STACK_LOCAL = properties.getProperty("browserstack.local");
        BROWSER_STACK_DEBUG = properties.getProperty("browserstack.debug");

        AODN_PORTAL = properties.getProperty("aodnPortal");

        DesiredCapabilities capability = getDesiredCapability(browser, browser_version, os, os_version, device, resolution);

        if (BROWSER_STACK_LOCAL.equals("true")) {
            driver = new RemoteWebDriver(new URL(BROWSER_STACK_URL), capability);

        } else {
            driver = new RemoteWebDriver(new URL(BROWSER_STACK_URL), capability);
        }
    }

    @org.testng.annotations.AfterClass
    public void tearDown() {
        driver.quit();
    }

    public DesiredCapabilities getDesiredCapability(String browser, String browser_version, String os, String os_version, String device, String resolution) {
        DesiredCapabilities capability = new DesiredCapabilities();

        capability.setCapability("browserstack.debug", BROWSER_STACK_LOCAL);
        capability.setCapability("browserstack.local", BROWSER_STACK_DEBUG);
        capability.setCapability("browser", browser);
        capability.setCapability("browser_version", browser_version);
        capability.setCapability("os", os);
        capability.setCapability("os_version", os_version);
        capability.setCapability("device", device);
        capability.setCapability("resolution", resolution);

/*        capability.setCapability("build", "version1");
        capability.setCapability("project", "newintropage");*/
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
            log.error("Unable to waitDrupal", e);
        }
    }
}

