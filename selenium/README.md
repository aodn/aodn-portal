**Setting up Local Testing**

`Download the appropriate binary:`

OS X (Lion, Mountain Lion, Mavericks) https://www.browserstack.com/browserstack-local/BrowserStackLocal-darwin-x64.zip

Linux 32-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-ia32.zip

Linux 64-bit https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip

Windows https://www.browserstack.com/browserstack-local/BrowserStackLocal-win32.zip

The download links are secure. The binaries are digitally signed, identifying the publisher as 'BrowserStack Ltd.'

Navigate to the folder containing the binary, and run it from the command-line interface.
Note: Running your Selenium tests on BrowserStack requires a username and an access key.

**OS X & Linux**

To test a private server, execute the binary:

_./BrowserStackLocal gHycUBmFvrs5PWq8qYqS_

Once the connection is made, you need to set the browserstack.local capability to true.

_caps.setCapability("browserstack.local", "true");_

**Windows**

To test a private server, execute the binary:

_BrowserStackLocal.exe gHycUBmFvrs5PWq8qYqS_

Once the connection is made, you need to set the browserstack.local capability to true.

_caps.setCapability("browserstack.local", "true");_