/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollection", function() {

    var dataCollection;

    beforeEach(function() {
        dataCollection = Portal.data.DataCollection.fromMetadataRecord({});
        spyOn(dataCollection, 'setFilters');
    });

    describe('getFiltersRequestParams()', function() {
        var testWfsLayerLinks;
        var testWmsLayerLinks;

        beforeEach(function() {
            Portal.app.appConfig.portal.metadataProtocols.wfs = 'wfs';
            Portal.app.appConfig.portal.metadataProtocols.wms = 'wms';

            dataCollection.getLayerSelectionModel = returns({
                getSelectedLayer: returns({
                    url: 'server url'
                })
            });
        });

        it('uses uri from selected layer from layer state', function() {
            dataCollection.getDownloadLayerName = returns('layerName');

            expect(dataCollection.getFiltersRequestParams().server).toBe('server url');
        });

        describe('getDownloadLayerName()', function() {
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
