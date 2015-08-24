/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollectionLayerAdapter", function() {
    it('indicates loading', function() {
        var layerState = {
            getSelectedLayer: returns(new OpenLayers.Layer()),
            on: noOp
        };
        var layerAdapter = new Portal.data.DataCollectionLayerAdapter({
            layerState: layerState
        });

        layerState.getSelectedLayer = returns({
            loading: true
        });
        expect(layerAdapter.isLoading()).toBe(true);

        layerState.getSelectedLayer = returns({
            loading: false
        });
        expect(layerAdapter.isLoading()).toBe(false);
    });
});
