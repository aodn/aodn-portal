/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollection", function() {

    var dataCollection;

    beforeEach(function() {
        dataCollection = new Portal.data.DataCollection();
        spyOn(dataCollection, 'getWmsLayerLinks').andReturn([]);
        spyOn(dataCollection, 'setFilters');
    });

    describe('getFiltersRequestParams()', function() {
        beforeEach(function() {
            dataCollection.getLayerSelectionModel = returns({
                getSelectedLayer: returns({
                    server: {uri: 'server url'}
                })
            });
            dataCollection.getWfsLayerLinks = returns([{
                data: {name: 'imos:wfs_layer'}
            }]);
            dataCollection.getWmsLayerLinks = returns([{
                data: {name: 'aodn:wms_layer'}
            }]);
        });

        it('uses uri from selected layer from layer state', function() {
            expect(dataCollection.getFiltersRequestParams().server).toBe('server url');
        });

        describe('getDownloadLayerName()', function() {
            it('uses WFS link if present', function() {
                expect(dataCollection.getFiltersRequestParams().layer).toBe('imos:wfs_layer');
            });

            it('uses WMS link otherwise', function() {
                dataCollection.getWfsLayerLinks = returns([]);

                expect(dataCollection.getFiltersRequestParams().layer).toBe('aodn:wms_layer');
            });

            it('uses WFS link with workspace name from WMS link if missing', function() {
                dataCollection.getWfsLayerLinks = returns([{
                    data: {name: 'wfs_layer'} // No namespace
                }]);

                expect(dataCollection.getFiltersRequestParams().layer).toBe('aodn:wfs_layer');
            });
        });
    });

    describe('layerstate', function() {
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
