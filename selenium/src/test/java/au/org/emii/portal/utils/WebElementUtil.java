
package au.org.emii.portal.utils;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import java.util.NoSuchElementException;


public class WebElementUtil {

    private static Logger log = Logger.getLogger(StringUtil.class.getName());


    public static void clickElementByXpath(String xpath, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with xpath "+xpath+"could not be found", e);
        }
    }

    public static void clickElementWithLinkText(String linkText, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.linkText(linkText));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text "+linkText+"could not be found", e);
        }
    }

    public static void clickLinkContainingText(String linkText, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath("//a[contains(.,'" + linkText + "')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Link text "+linkText+"could not be found", e);
        }
    }

    public static void clickButtonWithText(String text, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(.,'" + text + "')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(text + " element cannot be found", e);
        }
    }

    public static void clickElementById(String id, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.id(id));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with id "+id+" cannot be found", e);
        }
    }

    public static void clickElementWithClass(String className, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath("[contains(@class, '" + className + "')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class "+className+" cannot be found", e);
        }
    }

    public static void clickButtonWithClass(String className, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(@class, '" + className + "')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Element with class "+className+" cannot be found", e);
        }
    }

    public static void clickButtonWithTitle(String title, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath("//button[contains(@title, '"+title+"')]"));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with title "+title+" cannot be found", e);
        }
    }

    public static void clickButtonWithId(String id, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.id(id));
            element.click();
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Button with id "+id+" cannot be found", e);
        }
    }

    public static void selectDropDownTextById(String selectText, String selectId, WebDriver driver) {
        try {
            Select dropdown = new Select(driver.findElement(By.id(selectId)));
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public static void selectDropDownTextByClass(String selectText, String className, WebDriver driver) {
        try {
            Select dropdown = new Select(driver.findElement(By.xpath("[contains(@class, '" + className + "')]")));
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public static void selectDropDownTextByXpath(String selectText, String xpath, WebDriver driver) {
        try {
            Select dropdown = new Select(driver.findElement(By.xpath(xpath)));
            dropdown.selectByVisibleText(selectText);
        } catch (NoSuchElementException | AssertionError e) {
            log.error(selectText + " could not be selected", e);
        }
    }

    public static void enterInputStringById(String inputString, String inputId, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with id "+inputId+" could not be found", e);
        }
    }

    public static void enterInputStringByXpath(String inputString, String xpath, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
            element.sendKeys(new String[]{inputString});
        } catch (NoSuchElementException | AssertionError e) {
            log.error(inputString + " field with xpath "+xpath+" could not be found", e);
        }
    }

    public static void clearInputById(String inputId, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id "+inputId+" could not be found", e);
        }
    }

    public static void verifyInputText(String inputId, String matchText, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.id(inputId));
            Assert.assertNotNull(element);
            Assert.assertTrue("Unable to math text: " + matchText, element.getAttribute("value").equals(matchText));
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with id "+inputId+" could not be found", e);
        }
    }

    public static void clearInputByXpath(String xpath, WebDriver driver) {
        try {
            WebElement element = driver.findElement(By.xpath(xpath));
            Assert.assertNotNull(element);
            element.clear();
        } catch (NoSuchElementException | AssertionError e) {
            log.error(" Field with xpath "+xpath+" could not be found", e);
        }
    }


    public static void verifyValidationMessage(String validationMessage, WebDriver driver) {
        //Validation message test
        try {
            WebElement element = driver.findElement(By.xpath("//span[contains(.,'"+validationMessage+"')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Validation Message "+validationMessage+" could not be found", e);
        }
    }

    public static void verifyTextPresentOnPage(String text, WebDriver driver) {
        //Validation message test
        try {
            WebElement element = driver.findElement(By.xpath("[contains(.,'" + text + "')]"));
            Assert.assertNotNull(element);
        } catch (NoSuchElementException | AssertionError e) {
            log.error("Text "+text+" could not be found", e);
        }
    }

    public static void verifyPageTitle(String title, WebDriver driver) {
        // Check Page Title
        try {
            String pageTitle = driver.getTitle();
            Assert.assertTrue(pageTitle.contains(title));
        } catch (AssertionError e) {
            log.error("Assertion Failed", e);
        }
    }
}


