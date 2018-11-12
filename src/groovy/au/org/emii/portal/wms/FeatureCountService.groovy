package au.org.emii.portal.wms

import grails.converters.JSON
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class FeatureCountService {
    static final Logger log = LoggerFactory.getLogger(this)

    def getWfsFeatureCount(String server, String layer, String filter) {

        try {
            def cql = URLEncoder.encode(filter,"UTF-8")
            def url = "${server}SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=${layer}&outputFormat=json&CQL_FILTER=${cql}&count=1";
            def json = JSON.parse(url.toURL().text)
            return json.totalFeatures
        }
        catch (e) {
            log.error "Unable to parse feature count for server '${server}', layer '${layer}', filter '${filter}' - ${url}", e
        }
    }
}

