
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("GeoExt.ux.BaseLayerComboBox", function() {

    it('It loads only base layers from map on creation', function() {
        var map = new OpenLayers.Map({});

        map.addLayer(new OpenLayers.Layer.Vector('baseLayer', {isBaseLayer: true}));
        map.addLayer(new OpenLayers.Layer.Vector('overlay', {}));
        
        var baseLayerCombo = new GeoExt.ux.BaseLayerComboBox({map: map});
        
        expect(baseLayerCombo.getStore().getCount()).toEqual(1);
        expect(baseLayerCombo.getStore().getAt(0).get('title')).toEqual('baseLayer');
    });


});
