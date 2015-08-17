/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.BodaacDownloadHandler', function () {

    var handler;
    var options;

    var createHandler = function(onlineResource) {
        handler = new Portal.cart.BodaacDownloadHandler(onlineResource);
        options = handler.getDownloadOptions();
    };

    beforeEach(function() {

        createHandler({
            href: 'geoserver_url',
            name: 'layer_name#field_name'
        });
    });

    describe('getDownloadOptions', function() {

        it('has two valid options', function() {

            expect(options.length).toBe(2);
        });

        it('has valid options', function() {

            for (var i = 0; i < options.length; i++) {
                var option = options[i];

                expect(option.textKey).toBeNonEmptyString();
                expect(typeof option.handler).toBe('function');

                var params = option.handlerParams;
                var controllerArgs = params.downloadControllerArgs;

                expect(params.filenameFormat).toBeNonEmptyString();
                expect(controllerArgs).not.toBeUndefined();
                expect(controllerArgs.action).toBeNonEmptyString();
                expect(controllerArgs.urlFieldName).toBe('field_name');
            }
        });

        it('has no options when required info is missing', function() {

            createHandler({
                href: null,
                name: 'layer_name#field_name'
            });

            expect(options.length).toBe(0);
        });

        it('has no options when name is invalid', function() {

            createHandler({
                href: 'geoserver_url',
                name: 'only one value (ie. no separator)'
            });

            expect(options.length).toBe(0);
        });
    });

    describe('the url generator function', function() {

        var urlFn;
        var testCollection;
        var buildUrlSpy = jasmine.createSpy('_buildGetFeatureRequestUrl');

        beforeEach(function() {

            urlFn = handler._getUrlGeneratorFunction();

            testCollection = {
                getLayerState: returns({
                    getSelectedLayer: returns({
                        _buildGetFeatureRequestUrl: buildUrlSpy
                    })
                }),
                getFilters: returns([])
            };

            spyOn(Portal.filter.combiner, 'BodaacCqlBuilder').andReturn({
                buildCql: returns('the_cql')
            });

            urlFn(testCollection);
        });

        it('builds the correct URL', function() {

            expect(buildUrlSpy).toHaveBeenCalledWith(
                'geoserver_url',
                'layer_name',
                'csv',
                'the_cql'
            );
        });
    });

    describe('the estimate download size params', function() {

        var testCollection;

        beforeEach(function() {

            testCollection = {
                getLayerState: returns({
                    getSelectedLayer: returns({
                        _buildGetFeatureRequestUrl: returns('the_url')
                    })
                }),
                getFilters: returns([])
            };
        });

        it('build the correct params object', function() {

            var params = handler.getDownloadEstimateParams(testCollection);

            expect(params.url).toBe('the_url');
            expect(params.urlFieldName).toBe('field_name');
        });
    });
});
