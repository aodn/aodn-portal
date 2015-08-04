package au.org.emii.portal.wms
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

    void testStylesInvalidJson() {
        ncwmsServer.metaClass.getUrlContent = { url -> return "invalid json string" }

        def expected = [
            styles: null,
            palettes: null,
            defaultPalette: null
        ]
        def styles = ncwmsServer.getStyles("http://server", "layer")

        assertEquals expected, styles
    }

    void testStylesValidJson() {
        ncwmsServer.metaClass.getUrlContent = { url ->
            return validNcwmsMetadataResponse
        }

        def styles = ncwmsServer.getStyles("http://server", "layer")
        assertEquals '{"styles":["vector","boxfill"],"palettes":["redblue","alg","greyscale","alg2","ncview","occam","rainbow","sst_36","ferret","occam_pastel-30"],"defaultPalette":"rainbow"}', (styles as JSON).toString()
    }

    void testParseDatesWithData() {
        def datesWithDataJson = JSON.parse('{"2013":{"0":[1,2,31],"1":[5]},"2014":{"0":[2]}}')

        def datesWithData = ncwmsServer.parseDatesWithData(datesWithDataJson)

        def expected = '["2013-01-01T00:00:00Z","2013-01-02T00:00:00Z","2013-01-31T00:00:00Z","2013-02-05T00:00:00Z","2014-01-02T00:00:00Z"]'

        assertEquals expected, (datesWithData as JSON).toString()
    }

    void testFiltersInvalidJson() {
        ncwmsServer.metaClass.getUrlContent = { url -> return "invalid json string" }

        def filters = ncwmsServer.getFilters("http://server", "layer")
        assertEquals '[{"label":"Time","type":"TimeSeries","name":"timesteps","possibleValues":[]}]', (filters as JSON).toString()
    }

    void testParseTimeSteps() {
        def timeStepsJson = JSON.parse('["21:30:00.000Z","22:30:00.000Z","23:30:00.000Z"]')

        def timeSteps = ncwmsServer.parseTimeSteps("2014-10-10T00:00:00.000Z", timeStepsJson)

        def expected = ["2014-10-10T21:30:00.000Z","2014-10-10T22:30:00.000Z","2014-10-10T23:30:00.000Z"]

        assertEquals expected, timeSteps
    }
}
