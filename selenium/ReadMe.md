# Setting up Project

1. Import "selenium" as maven project into IntelliJ.
2. Right Click "selenium/src/test/resources/testng.xml" and select Run
3. Test results will be available on console and on browserstack dashboard - https://www.browserstack.com/automate
4. Html test report will be available at selenium/test-output/html/index.html
5. Test can also be executed from command line (inside selenium directory) using "mvn clean install" - Currently it does not produces html test report

# Running Test

Update pom.xml and add following properties
```
<browserstack.username>Username</browserstack.username>
<browserstack.automateKey>AccessKey</browserstack.automateKey>
<build>Your Name</build>
```

*Note: Comment the tests from testng.xml which you do not want to run to speed up the testing.*

# Setting up Local Testing

Download the appropriate binary:

1. OS X (Lion, Mountain Lion, Mavericks) https://www.browserstack.com/browserstack-local/BrowserStackLocal-darwin-x64.zip

2. Linux 32-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-ia32.zip

3. Linux 64-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip

4. Windows https://www.browserstack.com/browserstack-local/BrowserStackLocal-win32.zip

The download links are secure. The binaries are digitally signed, identifying the publisher as 'BrowserStack Ltd.'

Navigate to the folder containing the binary, and run it from the command-line interface.

*Note: Running your Selenium tests on BrowserStack requires a username and an access key.*

## OS X & Linux

To test a private server, execute the binary:

./BrowserStackLocal gHycUBmFvrs5PWq8qYqS
Once the connection is made, you need to set the browserstack.local capability to true.

1. Set "browserstack.local" to "true" in pom.xml
2. Set "aodnPortal" to localhost url of aodn-portal in pom.xml
3. Set "build" to "your-username" in pom.xml to identify your test results easily.

## Windows

To test a private server, execute the binary:

BrowserStackLocal.exe gHycUBmFvrs5PWq8qYqS
Once the connection is made, you need to set the browserstack.local capability to true.

1. Set "browserstack.local" to "true" in pom.xml
2. Set "aodnPortal" to localhost url of aodn-portal in pom.xml
3. Set "build" to "your-username" in pom.xml to identify your test results easily.
