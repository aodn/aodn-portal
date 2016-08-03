
describe("Portal.data.DataCollection", function() {

    var dataCollection;
    var isNcwmsSpy;

    beforeEach(function() {
        spyOn(Portal.data.DataCollection.prototype, '_loadFilters');
        isNcwmsSpy = spyOn(Portal.data.DataCollection.prototype, 'isNcwms').andReturn(true);
        spyOn(Portal.utils.ObservableUtils, 'makeObservable');
        dataCollection = Portal.data.DataCollection.fromMetadataRecord({});
    });

    describe('fromMetadataRecord()', function() {
        it('makes DataCollection Observable', function() {
            expect(Portal.utils.ObservableUtils.makeObservable).toHaveBeenCalled();
        });

        it('Starts the Filters loading if non-ncwms', function() {
            isNcwmsSpy.andReturn(false);
            dataCollection = Portal.data.DataCollection.fromMetadataRecord({});
            expect(dataCollection._loadFilters).toHaveBeenCalled();
        });

        it("Starts the Filters loading if ncwms", function() {
            isNcwmsSpy.andReturn(true);
            dataCollection = Portal.data.DataCollection.fromMetadataRecord({});
            expect(dataCollection._loadFilters).toHaveBeenCalled();
        });
    });

    describe('getFiltersRequestParams()', function() {
        var testWfsLayerLinks;
        var testWmsLayerLinks;

        beforeEach(function() {
            Portal.app.appConfig.portal.metadataProtocols.wfs = 'wfs';
            Portal.app.appConfig.portal.metadataProtocols.wms = 'wms';

            dataCollection.getLayerSelectionModel = returns({
                getSelectedLayer: returns({
                    url: 'server url',
                    server: {type: 'ncWMS'}
                })
            });
        });

        it('uses uri from selected layer from layer state', function() {
            dataCollection._getDownloadLayerName = returns('layerName');

            expect(dataCollection.getFiltersRequestParams().server).toBe('server url');
        });

        it('uses server from selected layer for the Layer controller', function() {
            dataCollection._getDownloadLayerName = returns('layerName');

            expect(dataCollection.getFiltersRequestParams().serverType).toBe('ncwms');
        });

        describe('_getDownloadLayerName()', function() {
            beforeEach(function() {
                testWfsLayerLinks = [{
                    name: 'imos:wfs_layer1'
                }, {
                    name: 'imos:wfs_layer2'
                }];

                testWmsLayerLinks = [{
                    name: 'aodn:wms_layer1'
                }, {
                    name: 'aodn:wms_layer2'
                }];

                dataCollection.getLinksByProtocol = function(protocols) {
                    if (protocols == 'wfs') {
                        return testWfsLayerLinks;
                    }
                    else if (protocols == 'wms') {
                        return testWmsLayerLinks;
                    }
                };
            });

            it('uses WFS link if present', function() {
                expect(dataCollection.getFiltersRequestParams().layer).toBe('imos:wfs_layer1');
            });

            it('uses WMS link otherwise', function() {
                testWfsLayerLinks = [];

                expect(dataCollection.getFiltersRequestParams().layer).toBe('aodn:wms_layer1');
            });

            it('uses WFS link with workspace name from WMS link if missing', function() {
                testWfsLayerLinks = [{
                    name: 'wfs_layer1' // No namespace
                }];

                expect(dataCollection.getFiltersRequestParams().layer).toBe('aodn:wfs_layer1');
            });
        });
    });

    describe('layerstate', function() {
        beforeEach(function() {
            spyOn(dataCollection, 'getLinksByProtocol').andReturn([]);
        });

        it('lazily initialises layer state', function() {
            var layerSelectionModel = dataCollection.getLayerSelectionModel();
            expect(layerSelectionModel).toBeInstanceOf(Portal.data.LayerSelectionModel);

            // Make sure we're reusing the same object.
            expect(dataCollection.getLayerSelectionModel()).toBe(layerSelectionModel);
        });

        it('returns correct WMS type', function() {
            spyOn(dataCollection.getLayerSelectionModel(), 'isNcwms').andReturn(true);
            expect(dataCollection.isNcwms()).toBe(true);
        });
    });
});
