/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms.filters

import grails.test.GrailsUnitTestCase

class GeoServerFiltersRequestTest extends GrailsUnitTestCase {

    def geoServerFiltersRequest

    void setUp() {
        geoServerFiltersRequest = new GeoServerFiltersRequest("http://geoserver-123.aodn.org.au/geoserver", "aodn:aodn_dsto_glider_trajectory_map")
    }

    void testGetLayerWorkspace() {
        assertEquals("aodn", geoServerFiltersRequest.getLayerWorkspace())
    }

    void testGetLayerName() {
        assertEquals("aodn_dsto_glider_trajectory_map", geoServerFiltersRequest.getLayerName())
    }

    void testGetRequestString() {
        assertEquals(
            "http://geoserver-123.aodn.org.au/geoserver/ows/request=enabledFilters&service=layerFilters&version=1.0.0&workspace=aodn&layer=aodn_dsto_glider_trajectory_map",
            geoServerFiltersRequest.getRequestString()
        )
    }
}
