
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.openlayers.LayerOptions", function() {
    
    var layerDescriptor;
    
    var layer = {
        isBaseLayer : true,
        projection : null,
        server : {
            type : "WMS-1.1.1"
        }
    };
    
    beforeEach(function() {
        layerDescriptor = new Portal.common.LayerDescriptor(layer);
    });
    
    it('testing setting of OpenLayers options', function() {
        var options = new Portal.ui.openlayers.LayerOptions(layerDescriptor);
        expect(options.version).toEqual('1.1.1');
        expect(options.isBaseLayer).toBeTruthy();
        expect(options.opacity).toEqual(1);
        expect(options.projection).toEqual(new OpenLayers.Projection(null));
    });
});
