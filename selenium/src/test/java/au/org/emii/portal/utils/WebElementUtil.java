package au.org.emii.portal.utils;

import org.apache.log4j.Logger;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;

import java.util.NoSuchElementException;

public class WebElementUtil {

    private static Logger log = Logger.getLogger(WebElementUtil.class.getName());

    private WebDriver driver;

    public WebElementUtil(WebDriver driver) {
        this.driver = driver;
    }

    public void clickElementByXpath(String xpath) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with xpath " + xpath + "could not be found", e);
        }
    }

    public void clickElementWithLinkText(String linkText) {
        try {
            WebElement element = driver.findElement(By.linkText(linkText));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text " + linkText + "could not be found", e);
        }
    }

    public void clickLinkContainingText(String linkText) {
        try {
            WebElement element = driver.findElement(By.xpath("//a[contains(.,'" + linkText + "')]"));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text " + linkText + "could not be found", e);
        }
    }

    public void clickButtonWithText(String text) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(.,'" + text + "')]"));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(text + " element cannot be found", e);
        }
    }

    public void clickElementById(String id) {
        try {
            WebElement element = driver.findElement(By.id(id));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with id " + id + " cannot be found", e);
        }
    }

    public void clickElementWithClass(String className) {
        try {
            WebElement element = driver.findElement(By.xpath("[contains(@class, '" + className + "')]"));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class " + className + " cannot be found", e);
        }
    }

    public void clickButtonWithClass(String className) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(@class, '" + className + "')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class " + className + " cannot be found", e);
        }
    }

    public void clickButtonWithTitle(String title) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(@title, '" + title + "')]"));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with title " + title + " cannot be found", e);
        }
    }

    public void clickButtonWithId(String id) {
        try {
            WebElement element = driver.findElement(By.id(id));
            Assert.assertNotNull(element);
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with id " + id + " cannot be found", e);
        }
    }

    public void selectDropDownTextById(String selectText, String selectId) {
        try {
            WebElement element = driver.findElement(By.id(selectId));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public void selectDropDownTextByClass(String selectText, String className) {
        try {
            WebElement element = driver.findElement(By.xpath("[contains(@class, '" + className + "')]"));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public void selectDropDownTextByXpath(String selectText, String xpath) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            Select dropdown = new Select(element);
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public void enterInputStringById(String inputString, String inputId) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with id " + inputId + " could not be found", e);
        }
    }

    public void enterInputStringByXpath(String inputString, String xpath) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with xpath " + xpath + " could not be found", e);
        }
    }

    public void clearInputById(String inputId) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id " + inputId + " could not be found", e);
        }
    }

    public void verifyInputText(String inputId, String matchText) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            Assert.assertTrue(element.getAttribute("value").equals(matchText), "Unable to math text: " + matchText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id " + inputId + " could not be found", e);
        }
    }

    public void clearInputByXpath(String xpath) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with xpath " + xpath + " could not be found", e);
        }
    }


    public void verifyValidationMessage(String validationMessage) {
        //Validation message test
        try {
            WebElement element = driver.findElement(By.xpath("//span[contains(.,'" + validationMessage + "')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Validation Message " + validationMessage + " could not be found", e);
        }
    }

    public void verifyTextPresentOnPage(String text) {
        //Validation message test
        try {
            WebElement element = driver.findElement(By.xpath("[contains(.,'" + text + "')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Text " + text + " could not be found", e);
        }
    }

    public void verifyPageTitle(String title) {
        // Check Page Title
        try {
            String pageTitle = driver.getTitle();
            Assert.assertTrue(pageTitle.contains(title));
        } catch (AssertionError e) {
            log.error("Assertion Failed", e);
        }
    }

    public boolean isElementClickable(By locator) {
        WebElement element = driver.findElement(locator);
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
}


