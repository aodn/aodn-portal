AODN Open Geospatial Portal
===========================

The AODN open geospatial portal is a [Grails](http://grails.org/) application for finding, visualising, and downloading geospatial data. 
The application integrates with the [GeoNetwork](http://geonetwork-opensource.org/) metadata catalog and [OGC Web Map Services](http://www.opengeospatial.org/standards/wms). 

You can view the portal in action at the following locations;

* [AODN](http://portal.aodn.org.au) the main AODN portal
* [IMOS](http://imos.aodn.org.au) the [Integrated Marine Observation Systems](http://www.imos.org.au) portal
* [WAODN](http://wa.aodn.org.au) a Western Australia-focused portal

## Features

* Faceted search for easy navigation of datasets.
* Animation controls such as pause, fast-forward, etc.
* Configurable themes and splash page.
* Save and share data visualisations.
* Subset and aggregate multiple datasets into a single file for download.
* Filter data before download.
* OpenID authentication.
* Advanced spatial search that ensures results have features in the region of interest.  Not just a bounding box intersection.

## Quick Navigation

* [Get Portal](#getting-your-hands-on-portal)
* [Configuration](#configuring-portal)
* [How Do I Drive This Thing?](#getting-started-how-do-i-drive-this-thing-)

### Getting Your Hands on Portal

Firstly we welcome contributions so please feel free to fork the project, address any issues or add features and submit
a pull request.

* [Building From Source](#building-from-source)
* [Can I Get A Pre-Built War?](#can-i-get-a-pre-built-war-)

#### Building From Source

If you want to build from source you will need to have [Grails](http://grails.org/) installed on your build machine.

Once you have the source it should be as simple as ```$ grails war``` in the root folder where you have checked out portal
then deploy the war to your application server.

Feel free to ignore the pom.xml, this is an old artifact from when we used Maven as our build tool. We now use the
Grails tooling directly to build our artifacts. We have a dependency on Maven to launch our [Jasmine](http://pivotal.github.com/jasmine/ "Jasmine BDD"),
we are in the process of removing that dependency, [you can help with that too](https://github.com/jkburges/grails-javascript-phantomjs "Grails JavaScript PhantomJS")

#### Can I Get A Pre-Built War?

Yes you can. You can write to us, info at emii dot org dot au to discuss the best way of getting portal and keeping your
version up to date.

## Configuring Portal

You can fork portal and have your configuration included in your code base however portal offers the ability to specify
your configuration externally via an environment context variable named ```aodn.configuration``` you can clone an
example [AODN config here](https://github.com/aodn/aodn-portal-config) and modify as required. The example should be
descriptive enough to get you up and running however you can always shoot questions at us via our contact email.

### Collaborating Applications

Portal has a few collaborating applications that you may also want to deploy

* [GeoNetwork](http://geonetwork-opensource.org/)
* [Geoserver](http://geoserver.org/)
* [An OpenID provider](http://openid.net/)

If you want to mimic the AODN portal searching capabilities then you should consider deploying an instance of
[spatial search](https://github.com/aodn/spatial-search) note that spatial search has a dependency on a specific
minimum version of GeoNetwork. If you cannot deploy at least that version then you should consider not using spatial
search for performance reasons and using GeoNetwork directly for spatial extent searching. Note that at time of writing
this means that your results may not be as fine grained as available via spatial search.

## Getting Started (How Do I Drive This Thing?)

Read the [Getting Started guide](https://github.com/aodn/aodn-portal/wiki/Getting-Started) on the wiki

