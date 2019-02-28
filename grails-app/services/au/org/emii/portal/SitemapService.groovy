package au.org.emii.portal

import groovy.json.JsonSlurper

class SitemapService {

    def grailsApplication

    def getUuidsAsTxt() {

        String urls = ""

        def geonetworkUrl = [grailsApplication.config.geonetwork.url, '/srv/eng/', grailsApplication.config.geonetwork.searchPath].join('');
        def searchRes = geonetworkUrl.toURL().text
        def res = new XmlSlurper().parseText(searchRes).declareNamespace('geonet' : 'http://www.fao.org/geonetwork')

        res.metadata.'geonet:info'.each(){
            urls += [grailsApplication.config.grails.serverURL.replaceFirst('/$', ""), '/search/uuid/', it.uuid, '\n' ].join('')
        }
        return urls
    }

    def getFacetsAsJson() {

        def geonetworkUrl = [grailsApplication.config.geonetwork.url, '/srv/eng/', grailsApplication.config.geonetwork.searchPath].join('');
        def searchRes = geonetworkUrl.toURL().text
        def res = new XmlSlurper().parseText(searchRes)//.declareNamespace('geonet' : 'http://www.fao.org/geonetwork')

/*        res.summary.dimension.each(){
            urls += [ it.text(), '\n' ].join('')
        }*/
        def jsonSlurper = new JsonSlurper()

        return ""
    }


}
