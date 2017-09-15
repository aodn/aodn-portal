# Setting up Project

1. Import "selenium" as maven project into IntelliJ.
2. Right Click "selenium/src/test/resources/testng.xml" and select Run (after making the changes to pom.xml)
3. Test results will be available on console and on browserstack dashboard - https://www.browserstack.com/automate
4. Html test report will be available at selenium/test-output/html/index.html
5. Test can also be executed from command line (inside selenium directory) using "mvn clean install" - Currently it does not produces html test report

# Changes to pom.xml (properties section)

        <build>putYourUsernameHere</build>
        <browserstack.username>yourBrowserStackUsername</browserstack.username>
        <browserstack.automateKey>yourBrowserStackAutomateKey</browserstack.automateKey>

**Example Config:**
        
        <build>Jenkins<build>
        <browserstack.username>jenkins3</browserstack.username>
        <browserstack.automateKey>gHycUgHycUgHycUgHyc</browserstack.automateKey>
        
To obtain your BrowserStack username and automate key, login to BrowserStack and go to https://www.browserstack.com/automate

You will see the details on the top left section of the site. 


# Setting up [Local Testing](https://www.browserstack.com/local-testing)

Download the appropriate binary:
- OS X (Lion, Mountain Lion, Mavericks) https://www.browserstack.com/browserstack-local/BrowserStackLocal-darwin-x64.zip
- Linux 32-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-ia32.zip
- Linux 64-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
- Windows https://www.browserstack.com/browserstack-local/BrowserStackLocal-win32.zip

The download links are secure. The binaries are digitally signed, identifying the publisher as 'BrowserStack Ltd.'

Navigate to the folder containing the binary, and run it from the command-line interface.
Note: Running your Selenium tests on BrowserStack requires a username and an access key.

## OS X & Linux
To test a private server, execute the binary:

` ./BrowserStackLocal YourSecretKey ` 
Once the connection is made, you need to set the browserstack.local capability to true.

## Windows
To test a private server, execute the binary:

` BrowserStackLocal.exe YourSecretKey `
Once the connection is made, you need to set the browserstack.local capability to true.

## Update pom.xml

```
        <browserstack.local>true</browserstack.local>
        <aodnPortal>http://localhost:9090/</aodnPortal>
```
        
        

