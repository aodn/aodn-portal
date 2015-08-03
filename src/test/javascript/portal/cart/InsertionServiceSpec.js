/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.InsertionService', function() {

    var mockInsertionService;
    var geoNetworkRecord;

    beforeEach(function() {
        mockInsertionService = new Portal.cart.InsertionService();

        geoNetworkRecord = {
            title: 'the title',
            uuid: '42',
            wmsLayer: {
                isNcwms: returns(false)
            },
            aggregator: { childAggregators: [] },
            getDataDownloadHandlers: returns([{}])
        };
    });

    describe('insertionValues', function() {

        var mockInjector;

        beforeEach(function() {

            mockInjector = {
                getInjectionJson: jasmine.createSpy('getInjectionJson')
            };

            spyOn(mockInsertionService, '_getNcwmsInjector').andReturn(mockInjector);
            spyOn(mockInsertionService, '_getWmsInjector').andReturn(mockInjector);
            spyOn(mockInsertionService, '_getNoDataInjector').andReturn(mockInjector);
        });

        it('creates an ncwms injector for ncwms layers', function() {
            mockInsertionService.insertionValues(getNcwmsRecord());
            expectGetInjectorToHaveBeenCalled(mockInsertionService._getNcwmsInjector)
        });

        it('creates a wms injector for wms layers', function() {
            mockInsertionService.insertionValues(getWmsRecord());
            expectGetInjectorToHaveBeenCalled(mockInsertionService._getWmsInjector);
        });

        it('creates a no data injector for layers containing no data', function() {
            mockInsertionService.insertionValues(getNoDataRecord());
            expectGetInjectorToHaveBeenCalled(mockInsertionService._getNoDataInjector);
        });

        afterEach(function() {
            expect(mockInjector.getInjectionJson).toHaveBeenCalled();
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

    function expectGetInjectorToHaveBeenCalled(getInjectorFn) {
        expect(getInjectorFn).toHaveBeenCalled();

        var getInjectorFns = [
            mockInsertionService._getNcwmsInjector,
            mockInsertionService._getWmsInjector,
            mockInsertionService._getNoDataInjector
        ];

        for (var i = 0; i < getInjectorFns.length; i++) {
            if (getInjectorFns[i] != getInjectorFn) {
                expect(getInjectorFns[i]).not.toHaveBeenCalled();
            }
        }
    }

    function getWmsRecord() {
        return geoNetworkRecord;
    }

    function getNcwmsRecord() {
        geoNetworkRecord.wmsLayer.isNcwms = returns(true);

        return geoNetworkRecord;
    }

    function getNoDataRecord() {
        geoNetworkRecord.getDataDownloadHandlers = returns([]);

        return geoNetworkRecord;
    }
});
