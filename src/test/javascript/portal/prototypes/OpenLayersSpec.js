
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('OpenLayers', function() {

    describe("Layer.WMS", function() {

        var openLayer;

        beforeEach(function() {
            openLayer = new OpenLayers.Layer.WMS();
        });

        it("no bounding box", function() {
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMinX = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMinY = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMaxX = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("has bounding box", function() {
            openLayer.bboxMinX = 10;
            openLayer.bboxMinY = 10;
            openLayer.bboxMaxX = 10;
            openLayer.bboxMaxY = 10;
            expect(openLayer.hasBoundingBox()).toBeTruthy();
        });

        describe("_is130", function() {
            it("returns false for ncwms", function() {
                openLayer.isNcwms = function() { return true };
                openLayer.server= {type: "NCWMS 1.3.0"};
                expect(openLayer._is130()).toBeFalsy();
            });

            it("returns true for 1.3.0 when not NCWMS", function() {
                openLayer.server= {type: "WMS 1.3.0"};
                expect(openLayer._is130()).toBeTruthy();
            });
        });

        describe("isRetrievedFromDatabase", function() {
            it("returns true when grailsLayerId is set", function() {
                openLayer.grailsLayerId =  2134;
                expect(openLayer.isRetrievedFromDatabase()).toBeTruthy();
            });

            it("returns false when grailsLayerId is not set", function() {
                expect(openLayer.isRetrievedFromDatabase()).toBeFalsy();
            });

        });


        describe("proxy", function() {
            it("appends an ampersand to url when uri includes a question mark", function() {
                openLayer.server= {username: "user", password: "pass", uri:"http://geoserver.uni.edu.au/geoserver/wms?namespace=org"};
                openLayer.proxy("proxy?url=");
                expect (openLayer.url).toEqual("proxy?url=http://geoserver.uni.edu.au/geoserver/wms?namespace=org&");
                expect (openLayer.localProxy).toEqual("proxy?url=");
            });
        });

        describe("proxy", function() {
            it("appends a question mark to url when uri doesn't include one", function() {
                openLayer.server= {username: "user", password: "pass", uri:"http://geoserver.uni.edu.au/geoserver/wms"};
                openLayer.proxy("proxy?url=");
                expect (openLayer.url).toEqual("proxy?url=http://geoserver.uni.edu.au/geoserver/wms?");
                expect (openLayer.localProxy).toEqual("proxy?url=");
            });
        });

        describe("getCqlFilter", function() {
            it("Returns filter if defined", function() {
                openLayer.params = {CQL_FILTER: "test='filter'"};

                expect (openLayer.getCqlFilter()).toEqual("test='filter'");
            });

            it("Returns empty string if cql filter not defined", function() {
                openLayer.params = {};

                expect (openLayer.getCqlFilter()).toEqual('');
            });
        });

        describe("setCqlFilter", function() {
            it("calls mergeParams for a new filter", function() {
                spyOn(openLayer, "mergeNewParams");

                openLayer.params = {CQL_FILTER: "test='filter'"};

                openLayer.setCqlFilter("attribute='anotherfilter'");

                expect(openLayer.mergeNewParams).toHaveBeenCalledWith({
                    CQL_FILTER : "attribute='anotherfilter'"
                });
            });

            it("does nothing if new filter equals old filter", function() {
                spyOn(openLayer, "mergeNewParams");

                openLayer.params = {CQL_FILTER: "test='filter'"};

                openLayer.setCqlFilter("test='filter'");

                expect(openLayer.mergeNewParams).not.toHaveBeenCalled();
            });

            it("deletes filter and redraws if filter is empty", function() {
                spyOn(openLayer, "redraw");

                openLayer.params = {CQL_FILTER: "test='filter'"};

                openLayer.setCqlFilter("");

                expect(openLayer.redraw).toHaveBeenCalled();
            });
        });

        describe("getDownloadFilter", function() {
            it("does not join cql filters with download filters", function() {
                openLayer.params = {CQL_FILTER: "test='filter'"};
                openLayer.downloadOnlyFilters = "depth>=10";

                var downloadFilter = openLayer.getDownloadFilter();

                expect(downloadFilter).toBe("depth>=10");
            });
        });

        describe('_getWfsServerUrl', function() {

            it('returns wfs server uri', function() {

                openLayer.wfsLayer = {server: {uri: 'wfs_server_uri/wms'}};

                expect(openLayer._getWfsServerUrl()).toBe('wfs_server_uri/wfs');
            });
        });

        describe('_getWfsLayerName', function() {

            it('returns wfsLayer name', function() {

                openLayer.wfsLayer = { name: 'argo_wfs' };

                expect(openLayer._getWfsLayerName()).toBe('argo_wfs');
            });
        });

        describe('getWmsLayerFeatureRequestUrl', function() {

            it('calls _buildGetFeatureRequestUrl correctly', function () {

                spyOn(openLayer, '_buildGetFeatureRequestUrl');

                openLayer.server = { uri: "uri" };
                openLayer.params = { LAYERS: 'name' };
                openLayer. downloadOnlyFilters = 'cql';

                openLayer.getWmsLayerFeatureRequestUrl('csv');

                expect(openLayer._buildGetFeatureRequestUrl).toHaveBeenCalledWith('uri', 'name', 'csv', 'cql');
            });
        });

        describe('getWfsLayerFeatureRequestUrl', function() {

            it('calls _buildGetFeatureRequestUrl correctly', function () {

                spyOn(openLayer, '_buildGetFeatureRequestUrl');

                openLayer.wfsLayer = { server: { uri: "wfs_uri" } };
                openLayer.wfsLayer.name = 'wfs_name';
                openLayer.downloadOnlyFilters = 'cql';

                openLayer.getWfsLayerFeatureRequestUrl('csv');

                expect(openLayer._buildGetFeatureRequestUrl).toHaveBeenCalledWith('wfs_uri', 'wfs_name', 'csv', 'cql');
            });
        });

        describe('_buildGetFeatureRequestUrl', function() {

            it('does not add a ? if not required', function() {

                var getFeatureUrl = openLayer._buildGetFeatureRequestUrl("wfs_url?a=b");

                expect(getFeatureUrl.startsWith('wfs_url?a=b&')).toBe(true);
            });

            it('adds a ? if required', function() {

                var getFeatureUrl = openLayer._buildGetFeatureRequestUrl("wfs_url");

                expect(getFeatureUrl.startsWith('wfs_url?')).toBe(true);
            });

            it('does not use the CQL filter if it is missing', function() {

                var expectedUrl = 'wfs_url?' +
                    'typeName=type_name' +
                    '&SERVICE=WFS' +
                    '&outputFormat=txt' +
                    '&REQUEST=GetFeature' +
                    '&VERSION=1.0.0';

                var getFeatureUrl = openLayer._buildGetFeatureRequestUrl('wfs_url', 'type_name', 'txt');

                expect(getFeatureUrl).toBe(expectedUrl);
            });

            it('uses the CQL filter if it is present', function() {

                var expectedUrl = 'wfs_url?' +
                    'typeName=type_name' +
                    '&SERVICE=WFS' +
                    '&outputFormat=csv' +
                    '&REQUEST=GetFeature' +
                    '&VERSION=1.0.0' +
                    '&CQL_FILTER=cql%20%25%3A%2F';

                var getFeatureUrl = openLayer._buildGetFeatureRequestUrl('wfs_url', 'type_name', 'csv', 'cql %:/');

                expect(getFeatureUrl).toBe(expectedUrl);
            });
        });
    });

    describe('Geometry', function() {
        describe('isBox', function() {
            it('returns true when box', function() {
                expect(OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 2,3 4,1 4,1 2))').isBox()).toEqual(true);
            });

            it('returns false when box', function() {
                expect(OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 4,1 2))').isBox()).toEqual(false);
            });
        });
    });
});
