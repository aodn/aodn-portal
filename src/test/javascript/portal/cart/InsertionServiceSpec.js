/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.InsertionService', function() {

    var mockInsertionService;
    var geoNetworkRecord;
    var html;

    beforeEach(function() {
        mockInsertionService = new Portal.cart.InsertionService();

        geoNetworkRecord = {
            title: 'the title',
            uuid: '42',
            wmsLayer: {
                isNcwms: noOp
            }
        };
    });

    describe('insertionValues', function() {

        beforeEach(function() {
            spyOn(mockInsertionService, '_getNcwmsInjector');
            spyOn(mockInsertionService, '_getWmsInjector');
            spyOn(mockInsertionService, '_getNoDataInjector');
        });

        it('creates an ncwms injector for ncwms layers', function() {

            html = mockInsertionService.insertionValues(getNcwmsRecord());

            expect(mockInsertionService._getNcwmsInjector).toHaveBeenCalled();
            expect(mockInsertionService._getWmsInjector).not.toHaveBeenCalled();
            expect(mockInsertionService._getNoDataInjector).not.toHaveBeenCalled();
        });

        it('creates a wms injector for wms layers', function() {

            html = mockInsertionService.insertionValues(getWmsRecord());

            expect(mockInsertionService._getNcwmsInjector).not.toHaveBeenCalled();
            expect(mockInsertionService._getWmsInjector).toHaveBeenCalled();
            expect(mockInsertionService._getNoDataInjector).not.toHaveBeenCalled();
        });

        it('creates a no data injector for layers containing no data', function() {

            html = mockInsertionService.insertionValues(getNoDataRecord());

            expect(mockInsertionService._getNcwmsInjector).not.toHaveBeenCalled();
            expect(mockInsertionService._getWmsInjector).not.toHaveBeenCalled();
            expect(mockInsertionService._getNoDataInjector).toHaveBeenCalled();
        });
    });

    describe('download confirmation', function() {
        it('delegates to the download panel for confirmation', function() {
            mockInsertionService.downloadPanel = {
                confirmDownload: noOp
            };
            spyOn(mockInsertionService.downloadPanel, 'confirmDownload');

            var collection = {};
            var callback = noOp;
            var params = {};

            mockInsertionService.downloadWithConfirmation(collection, this, callback, params);

            expect(mockInsertionService.downloadPanel.confirmDownload).toHaveBeenCalledWith(
                collection, this, callback, params
            );
        });
    });

    describe('is downloadable', function() {
        it('returns true when collection has associated wfs layer', function() {
            geoNetworkRecord.wmsLayer.wfsLayer = {};

            expect(mockInsertionService._isDownloadable(geoNetworkRecord)).toBeTruthy();
        });

        it('returns true when collection is aggregatable using aodaac', function() {
            var aggregators = ["AODAAC"];

            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            expect(mockInsertionService._isDownloadable(geoNetworkRecord, aggregators)).toBeTruthy();
        });

        it('returns true when collection is aggregatable using bodaac', function() {
            var aggregators = ["BODAAC"];

            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            expect(mockInsertionService._isDownloadable(geoNetworkRecord, aggregators)).toBeTruthy();
        });

        it('returns true when collection is aggregatable using gogoduck', function() {
            var aggregators = ["GoGoDuck"];

            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

            expect(mockInsertionService._isDownloadable(geoNetworkRecord, aggregators)).toBeTruthy();
        });

        it("returns false when collection doesn't have associated wfs layer or download URL field", function() {
            var aggregators = [];

            expect(mockInsertionService._isDownloadable(geoNetworkRecord, aggregators)).toBeFalsy();
        });
    });

    describe('returnAggregatorTypes', function() {
        it('returns an array of aggregators for the supplied collection', function() {

            var mockAggr;

            geoNetworkRecord.links = [
                {
                    protocol: "IMOS:AGGREGATION--aodaac",
                    name: "AODAAC"
                },
                {
                    protocol: "IMOS:AGGREGATION--bodaac",
                    name: "BODAAC"
                },
                {
                    protocol: "IMOS:AGGREGATION--gogoduck",
                    name: "GoGoDuck"
                }
            ];

            mockAggr = mockInsertionService._returnAggregatorTypes(geoNetworkRecord);
            expect(mockAggr[0]).toEqual("AODAAC");
            expect(mockAggr[1]).toEqual("BODAAC");
            expect(mockAggr[2]).toEqual("GoGoDuck");
        });
    });

    function getWmsRecord() {

        geoNetworkRecord.wmsLayer.wfsLayer = {};
        geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

        return geoNetworkRecord;
    }

    function getNcwmsRecord() {
        geoNetworkRecord.links = [
            {
                protocol: "IMOS:AGGREGATION--aodaac",
                name: "AODAAC"
            }
        ];

        geoNetworkRecord.wmsLayer.isNcwms = function() {return true};

        return geoNetworkRecord;
    }

    function getNoDataRecord() {
        geoNetworkRecord.wmsLayer.isNcwms = function() {return false};

        return geoNetworkRecord;
    }
});
