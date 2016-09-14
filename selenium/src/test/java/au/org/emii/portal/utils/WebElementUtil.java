package au.org.emii.portal.utils;

import org.apache.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;

public class WebElementUtil {

    private static Logger log = Logger.getLogger(WebElementUtil.class.getName());

    private WebDriver driver;
    private final int TIMEOUT = 30;
    private final int POLLING_PERIOND = 1;
    private String originalHandle;

    public WebElementUtil(WebDriver driver) {
        this.driver = driver;
        this.originalHandle = driver.getWindowHandle();
    }

    public void clickElementByXpath(String xpath) {
        try {
            click(By.xpath(xpath));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with xpath " + xpath + "could not be found", e);
            throw e;
        }
    }

    public void clickElementWithLinkText(String linkText) {
        try {
            click(By.linkText(linkText));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text " + linkText + "could not be found", e);
            throw e;
        }
    }

    public void clickLinkContainingText(String linkText) {
        try {
            click(By.xpath("//a[contains(.,'" + linkText + "')]"));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text " + linkText + "could not be found", e);
            throw e;
        }
    }

    public void clickLinkWithTitle(String title) {
        try {
            By xpath = By.xpath("//a[contains(@title, '" + title + "')]");
            click(xpath);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with title " + title + " cannot be found", e);
            throw e;
        }
    }

    public void clickButtonWithText(String text) {
        try {
            click(By.xpath("//button[contains(.,'" + text + "')]"));
        } catch (NoSuchElementException | AssertionError e) {
            log.error(text + " element cannot be found", e);
            throw e;
        }
    }

    public void clickSpanWithText(String text) {
        try {
            click(By.xpath("//span[contains(.,'" + text + "')]"));
        } catch (NoSuchElementException | AssertionError e) {
            log.error(text + " element cannot be found", e);
            throw e;
        }
    }

    public void clickElementById(String id) {
        try {
            click(By.id(id));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with id " + id + " cannot be found", e);
            throw e;
        }
    }

    public void clickElementWithClass(String className) {
        try {
            click(By.xpath("[contains(@class, '" + className + "')]"));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class " + className + " cannot be found", e);
            throw e;
        }
    }

    public void clickButtonWithClass(String className) {
        try {
            click(By.xpath("//button[contains(@class, '" + className + "')]"));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class " + className + " cannot be found", e);
            throw e;
        }
    }

    public void clickButtonWithTitle(String title) {
        try {
            By xpath = By.xpath("//button[contains(@title, '" + title + "')]");
            click(xpath);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with title " + title + " cannot be found", e);
            throw e;
        }
    }

    public void clickButtonWithId(String id) {
        try {
            click(By.id(id));
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with id " + id + " cannot be found", e);
            throw e;
        }
    }

    public void selectDropDownTextById(String selectText, String selectId) {
        try {
            WebElement element = findElement(By.id(selectId));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
            throw e;
        }
    }

    public void selectDropDownTextByClass(String selectText, String className) {
        try {
            WebElement element = findElement(By.xpath("[contains(@class, '" + className + "')]"));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
            throw e;
        }
    }

    public void selectDropDownTextByXpath(String selectText, String xpath) {
        try {
            WebElement element = findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
            throw e;
        }
    }

    public void enterInputStringById(String inputString, String inputId) {
        try {
            WebElement element = findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with id " + inputId + " could not be found", e);
            throw e;
        }
    }

    public void enterInputStringByXpath(String inputString, String xpath) {
        try {
            WebElement element = findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with xpath " + xpath + " could not be found", e);
            throw e;
        }
    }

    public void clearInputById(String inputId) {
        try {
            WebElement element = findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id " + inputId + " could not be found", e);
            throw e;
        }
    }

    public void verifyInputText(String inputId, String matchText) {
        try {
            WebElement element = findElement(By.id(inputId));
            Assert.assertNotNull(element);
            Assert.assertTrue(element.getAttribute("value").equals(matchText), "Unable to math text: " + matchText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id " + inputId + " could not be found", e);
            throw e;
        }
    }

    public void clearInputByXpath(String xpath) {
        try {
            WebElement element = findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with xpath " + xpath + " could not be found", e);
            throw e;
        }
    }


    public void verifyValidationMessage(String validationMessage) {
        try {
            WebElement element = findElement(By.xpath("//span[contains(.,'" + validationMessage + "')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Validation Message " + validationMessage + " could not be found", e);
            throw e;
        }
    }

    public void verifyTextPresentOnPage(String text) {
        try {
            WebElement element = findElement(By.xpath("[contains(.,'" + text + "')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Text " + text + " could not be found", e);
            throw e;
        }
    }

    public void verifyPageTitle(String title) {
        try {
            WebElement element = findElement(By.xpath("/html/head/title"));
            String pageTitle = element.getAttribute("innerHTML");
            Assert.assertTrue(pageTitle.contains(title));
        } catch (AssertionError e) {
            log.error("Assertion Failed", e);
            log.error(String.format("Expected Title:%s", title));
            log.error(String.format("Page Title:%s", driver.getTitle()));
            throw e;
        }
    }

    public void verifyInnerHtml(String innerHtml) {
        try {
            Assert.assertTrue(driver.getPageSource().contains(innerHtml));
        } catch (AssertionError e) {
            log.error("Assertion Failed", e);
            log.error(String.format("Expected Content:%s", innerHtml));
            log.error(String.format("Page Content:%s", driver.getPageSource()));
            throw e;
        }
    }

    public boolean isElementClickable(By locator) {
        WebElement element = findElement(locator);
        return (element != null && element.isDisplayed() && element.isEnabled()) ? true : false;
    }

    public void acceptAlert(WebDriver driver) {
        // Check the presence of alert
        Alert alert = driver.switchTo().alert();
        // if present consume the alert
        alert.accept();
    }

    public void cancelAlert(WebDriver driver) {
        // Check the presence of alert
        Alert alert = driver.switchTo().alert();
        // if present consume the alert
        alert.dismiss();
    }

    public void clickMap(WebElement mapPanel, int xOffset, int yOffset) {
        Actions builder = new Actions(driver);
        builder.moveToElement(mapPanel, xOffset, yOffset).click().build().perform();
    }

    public WebElement findElement(By by) {
        WebElement element = null;
        FluentWait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(TIMEOUT, TimeUnit.SECONDS)
                .pollingEvery(POLLING_PERIOND, TimeUnit.SECONDS)
                .ignoring(NoSuchElementException.class)
                .ignoring(StaleElementReferenceException.class);
        int attempts = 1, totalAttempts = 2;
        while(attempts <= totalAttempts) {
            try {
                element = wait.until(
                        ExpectedConditions.presenceOfElementLocated(by));
                break;
            } catch(NoSuchElementException | TimeoutException | StaleElementReferenceException e) {
                log.debug(String.format("Unable to find element %s. Attempt: %s Total Attempts: %s. Error:%s", by.toString(), attempts, totalAttempts, e.getMessage()));
            }
            attempts++;
        }
        return element;
    }

    public void click(By by, WebElement element) {
        int attempts = 1, totalAttempts = 2;
        while(attempts <= totalAttempts) {
            try {
                if (element == null) {
                    element = findElement(by);
                    Assert.assertNotNull(element);
                }
                WebDriverWait wait = new WebDriverWait(driver, TIMEOUT);
                wait.until(ExpectedConditions.elementToBeClickable(element));
                element.sendKeys(Keys.RETURN); // element.click() does not work in some environments
                break;
            } catch(Exception e) {
                log.debug(String.format("Unable to click element %s. Attempt: %s Total Attempts: %s", by.toString(), attempts, totalAttempts));
                log.debug(String.format("Error:%s", e.getMessage()));
            }
            attempts++;
        }
    }

    public void click(By by) {
        click(by, null);
    }

    public void click(WebElement element) {
        click(null, element);
    }

    public void switchToNewTab() {
        ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
        // Do not switch if browser fails to open new tab
        if(tabs.size() > 1) {
            driver.switchTo().window(tabs.get(1));
        }
    }

    public void switchToOriginalTab() {
        for(String handle : driver.getWindowHandles()) {
            if (!handle.equals(originalHandle)) {
                driver.switchTo().window(handle);
                driver.close();
            }
        }

        driver.switchTo().window(originalHandle);
    }

    public void clickElementBy(By by) {
        click(by);
    }
}


