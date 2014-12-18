package au.org.emii.portal.wms.filters

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

class GeoServerFiltersRequest {

    def final request = "enabledFilters"
    def final service = "layerFilters"
    def final version = "1.0.0"

    def server
    def layer

    public GeoServerFiltersRequest(server, layer) {
        this.server = server
        this.layer = layer
    }

    def getRequestString() {
        return "${server}/ows/request=${request}&service=${service}&version=${version}&workspace=${getLayerWorkspace()}&layer=${getLayerName()}"
    }

    def getLayerWorkspace() {
        return layer.split(":")[0]
    }

    def getLayerName() {
        return layer.split(":")[1]
    }
}
