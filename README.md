AODN Open Geospatial Portal
===========================

[![Build Status](https://travis-ci.org/aodn/aodn-portal.png?branch=master)](https://travis-ci.org/aodn/aodn-portal)

The AODN open geospatial portal is a [Grails](http://grails.org/) application for discovering, subsetting, and downloading geospatial data.

The application is a stateless front end to other servers: 

* [GeoNetwork](http://geonetwork-opensource.org/) metadata catalog
* [GeoServer](http://geoserver.org/) data server (WMS and WFS).
* [ncWMS](http://www.resc.rdg.ac.uk/trac/ncWMS/) web map server
* [GoGoDuck](https://github.com/aodn/go-go-duck) netCDF subsetting and aggregation service

You can view the portal in action at [IMOS](http://imos.aodn.org.au), which always runs the latest version of the code.

## Contact
Please post any questions in our [forum](http://portalhelp.aodn.org.au/Portal2_help/?q=forum).

## Features
* Easy 1-2-3 workflow (1.Search, 2.Subset, 3.Download)
* Faceted search for easy discovery of data collections
* Visualise subsetting results before download via WMS
* Download data from a variety of web services (eg. WFS)
* Configurable themes and splash page

## Getting Your Hands on Portal
* [Building From Source](#building-from-source)
* [Can I Get A Pre-Built War?](#can-i-get-a-pre-built-war)
* [Installation](#installation)

## Building From Source
If you want to build from source you will need to have [Grails](http://grails.org/) 2.4.4 installed on your build machine.

The recommended way of installing grails is by using [SdkMan](http://sdkman.io/):
```
$ curl -s http://get.sdkman.io | bash 
$ source $HOME/.sdkman/bin/sdkman-init.sh
$ sdk use grails 2.4.4
```

Once you have the source it should be as simple as ```$ grails war``` in the root folder where you have checked out portal
then deploy the war to your application server.

Feel free to ignore the pom.xml, this is an old artifact from when we used Maven as our build tool. We now use the
Grails tooling directly to build our artifacts. We have a dependency on Maven to launch our [Jasmine](http://pivotal.github.com/jasmine/ "Jasmine BDD"),
we are in the process of removing that dependency, [you can help with that too](https://github.com/jkburges/grails-javascript-phantomjs "Grails JavaScript PhantomJS")

## Can I Get A Pre-Built War?
Yes, you can download it from our [Jenkins server](https://jenkins.aodn.org.au/job/portal_4_prod/).

## Installation
The AODN portal has been tested with Tomcat.  All you need to do is deploy the war and add a configuration file that tells the portal:
* Where to find goenetwork
* Your CSS for branding and styling
* Trusted servers

Define the location of the configuration file by setting an environment context variable named ```aodn.configuration```

One way to do this is by adding a file called &lt;context&gt;.xml in the ```$CATALINA_BASE/conf/[enginename]/[hostname]/``` directory. Where &lt;context&gt; matches the context of the deployed war (eg. "aodn-portal-3.42.1-production.xml").  Set the variable by adding the following line to the file: 
```<Environment name="aodn.configuration" value="<path to file>/Portal.groovy" type="java.lang.String" override="true"/>```

Then add the file called ```portal.groovy```

You can clone an example [here](https://github.com/aodn/aodn-portal/blob/master/grails-app/conf/Config.groovy) and modify as required. 

## Getting Started (How Do I Drive This Thing?)
Read the [Getting Started guide](https://github.com/aodn/aodn-portal/wiki/Getting-Started) on the wiki

## Contributing
We welcome contributions so please feel free to fork the project, address any issues or add features and submit
a pull request.

--
The IMOS Portal is used to publish the [IMOS data collection](https://imos.aodn.org.au/data_collections.html).

