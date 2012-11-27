
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.LayerStore", function() {
    
    var layerStore;
    
    beforeEach(function() {
        layerStore = new Portal.data.LayerStore();
        expect(layerStore.getCount()).toBe(0);
    });
    
    function createOpenLayer() {
        return new OpenLayers.Layer.WMS(
                "the title",
                "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
                {},
                {}
            );
    }
    
    it('add layer descriptor', function() {
        
        var layerDescriptor = new Portal.common.LayerDescriptor({
            title : 'test',
            server: {
                type: "WMS-1.1.1",
                uri: "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi"         
            }        
        });
        
        layerStore.addUsingDescriptor(layerDescriptor);
        expect(layerStore.getCount()).toBe(1);
    });
    
    
    // add open layer
    it('add open layer', function() {
        
        layerStore.addUsingOpenLayer(createOpenLayer());
        expect(layerStore.getCount()).toBe(1);
    });
    
    // remove open layer
    it('remove open layer', function() {
        
        var openLayer = createOpenLayer();
        layerStore.addUsingOpenLayer(openLayer);
        expect(layerStore.getCount()).toBe(1);
        
        layerStore.removeUsingOpenLayer(openLayer);
        expect(layerStore.getCount()).toBe(0);
    });
});
