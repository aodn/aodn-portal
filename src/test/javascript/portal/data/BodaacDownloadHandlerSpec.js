/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.BodaacDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.BodaacDownloadHandler(/* onlineResource not used yet */);
    });

    describe('getDownloadOptions', function() {

        var options;

        beforeEach(function() {

            options = handler.getDownloadOptions();
        });

        it('has two valid options', function() {

            expect(options.length).toBe(2);
        });

        it('has valid options', function() {

            for (var i = 0; i < options.length; i++) {
                var option = options[i];

                expect(option.textKey).toBeNonEmptyString();
                expect(typeof option.handler).toBe('function');

                var params = option.handlerParams;

                expect(params.filenameFormat).toBeNonEmptyString();
                expect(params.downloadControllerArgs).not.toBeUndefined();
                expect(params.downloadControllerArgs.action).toBeNonEmptyString();
            }
        });
    });

    describe('the click handler', function() {

        var clickHandler;
        var testCollection;
        var testHandlerParams;
        var buildUrlSpy = jasmine.createSpy('_buildGetFeatureRequestUrl');

        beforeEach(function() {

            clickHandler = handler._getClickHandler();

            testCollection = {
                wmsLayer: {
                    bodaacLayerName: 'wms_layer_name',
                    grailsLayerId: 777,
                    wfsLayer: {
                        server: { uri: 'geoserver/wms/' }
                    },
                    getDownloadFilter: function() { return 'the_cql' },
                    _buildGetFeatureRequestUrl: buildUrlSpy
                }
            };
            testHandlerParams = {
                downloadControllerArgs: {}
            };

            clickHandler(testCollection, testHandlerParams);
        });

        it('updates the handlerParams', function() {

            expect(testHandlerParams.downloadControllerArgs.layerId).toBe(777);
        });

        it('builds the correct URL', function() {

            expect(buildUrlSpy).toHaveBeenCalledWith(
                'geoserver/wfs/',
                'wms_layer_name',
                'csv',
                'the_cql'
            );
        });
    });
});
