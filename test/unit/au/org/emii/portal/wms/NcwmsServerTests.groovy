/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms
import au.org.emii.portal.wms.NcwmsServer
import org.codehaus.groovy.grails.plugins.testing.GrailsMockHttpSession
import grails.converters.JSON

import grails.test.GrailsUnitTestCase

class NcwmsServerTests extends GrailsUnitTestCase {

    def ncwmsServer
    def validNcwmsMetadataResponse

    protected void setUp() {
        super.setUp()
        ncwmsServer = new NcwmsServer()

        validNcwmsMetadataResponse = '{"units":"m s-1","bbox":["113.15197","-33.433849","115.741219","-30.150743"],"scaleRange":["0.0","1.8"],"numColorBands":253,"supportedStyles":["vector","boxfill"],"datesWithData":{"2013":{"0":[1,2,3,4,31],"1":[5]},"2014":{"0":[1,2,3,4,5,6],"4":[1,2,3,4,5,6],"5":[1,2,3]}},"palettes":["redblue","alg","greyscale","alg2","ncview","occam","rainbow","sst_36","ferret","occam_pastel-30"],"defaultPalette":"rainbow","logScaling":false}'
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testStylesInvalidJson() {
        ncwmsServer.metaClass.getUrlContent = { url -> return "invalid json string" }
        def styles = ncwmsServer.getStyles("http://server", "layer")
        assertEquals styles, []
    }

    void testStylesValidJson() {
        ncwmsServer.metaClass.getUrlContent = { url ->
            return validNcwmsMetadataResponse
        }

        def styles = ncwmsServer.getStyles("http://server", "layer")
        assertEquals (((styles as JSON).toString()), '{"styles":["vector","boxfill"],"palettes":["redblue","alg","greyscale","alg2","ncview","occam","rainbow","sst_36","ferret","occam_pastel-30"]}')
    }

    void testParseDatesWithData() {
        def datesWithDataJson = JSON.parse('{"2013":{"0":[1,2,31],"1":[5]},"2014":{"0":[2]}}')

        def datesWithData = ncwmsServer.parseDatesWithData(datesWithDataJson)

        def expected = '["2013-01-01T00:00:00Z","2013-01-02T00:00:00Z","2013-01-31T00:00:00Z","2013-02-05T00:00:00Z","2014-01-02T00:00:00Z"]'

        assertEquals (((datesWithData.sort() as JSON).toString()), expected)
    }

    void testFiltersInvalidJson() {
        ncwmsServer.metaClass.getUrlContent = { url -> return "invalid json string" }

        def filters = ncwmsServer.getFilters("http://server", "layer")
        assertEquals ((filters as JSON).toString(), '[{"label":"Time","type":"TimeSeries","name":"timesteps","possibleValues":[]}]')
    }
}
