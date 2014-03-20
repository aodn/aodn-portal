/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.InsertionService', function() {

    var mockInsertionService;

    beforeEach(function() {
        mockInsertionService = new Portal.cart.InsertionService();

        geoNetworkRecord = {wmsLayer: {}};
    });

    describe('returnStringInjectionForLayer', function() {

        beforeEach(function() {
            spyOn(mockInsertionService, '_getNcwmsInjector');
            spyOn(mockInsertionService, '_getWmsInjector');
            spyOn(mockInsertionService, '_getNoDataInjector');
        });

        it('creates an ncwms injector for ncwms layers', function() {

            geoNetworkRecord.wmsLayer.isNcwms = function() {return true};
            geoNetworkRecord.wmsLayer.wfsLayer = true;

            mockInsertionService.returnStringInjectionForLayer();

            expect(mockInsertionService._getNcwmsInjector).toHaveBeenCalled();
        });

        it('creates a wms injector for wms layers', function() {

            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};
            geoNetworkRecord.wmsLayer.wfsLayer = true;

            mockInsertionService.returnStringInjectionForLayer();

            expect(mockInsertionService._getWmsInjector).toHaveBeenCalled();
        });

        it('creates a no data injector for layers containing no data', function() {

            geoNetworkRecord.wmsLayer.isNcwms = function() {return false};
            mockInsertionService.returnStringInjectionForLayer();

            expect(mockInsertionService._getNoDataInjector).toHaveBeenCalled();
        });
    });
});