describe('Portal.cart.WfsDownloadHandler', function () {

    describe('getDownloadOptions', function() {

        var downloadOptions;

        describe('when required info is present', function() {

            beforeEach(function() {

                var testResource = {
                    name: 'layer_name',
                    href: 'server_url'
                };
                var handler = new Portal.cart.WfsDownloadHandler(testResource);
                downloadOptions =  handler.getDownloadOptions();
            });

            it('should return one download handler', function() {

                expect(downloadOptions.length).toBe(1);
            });

            it('should return a function which calls other appropriate functions', function() {

                var downloadOption = downloadOptions[0];

                expect(downloadOption.textKey).toBeNonEmptyString();
                expect(typeof downloadOption.handler).toBe('function');
                expect(downloadOption.handlerParams).not.toBeNull();

                var downloadHandler = downloadOption.handler;

                spyOn(OpenLayers.Layer.WMS, 'getFeatureRequestUrl');

                var dummyLayer = {
                    getCsvDownloadFormat: jasmine.createSpy('getCsvDownloadFormat').andReturn('csv')
                };
                var dummyFilters = ['filters'];
                var dummyCollection = {
                    getLayerSelectionModel: returns({
                        getSelectedLayer: returns(dummyLayer)
                    }),
                    getFilters: returns(dummyFilters)
                };

                downloadHandler(dummyCollection);

                expect(dummyLayer.getCsvDownloadFormat).toHaveBeenCalled();
                expect(OpenLayers.Layer.WMS.getFeatureRequestUrl).toHaveBeenCalledWith(dummyFilters, 'server_url', 'layer_name', 'csv');
            });
        });

        describe('when required info is missing', function() {

            beforeEach(function() {

                var testResource = {/* empty */};
                var handler = new Portal.cart.WfsDownloadHandler(testResource);
                downloadOptions = handler.getDownloadOptions();
            });

            it('should not return any download options', function() {

                expect(downloadOptions.length).toBe(0);
            });
        });
    });
});
