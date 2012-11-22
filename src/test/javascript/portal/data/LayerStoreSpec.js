
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
    
    it('add layer descriptor', function() {
        
        // This descriptor can be cut-down to relevant fields once the LayerDescriptor to
        // OpenLayers.Layer.WMS converter is written.
        var layerDesc = {
            "abstractTrimmed": null,
            "activeInLastScan": true,
            "allStyles": "","bboxMaxX": null,
            "bboxMaxY": null,
            "bboxMinX": null,
            "bboxMinY": null,
            "blacklisted": false,
            "cache": false,
            "cql": null,
            "dataSource": "Unknown",
            "filters": [],
            "id": 28,
            "isBaseLayer": true,
            "lastUpdated": "2012-03-26T01: 25: 23Z",
            "layerHierarchyPath": null,
            "layers": [],
            "name": "HiRes_aus-group",
            "namespace": null,
            "overrideMetadataUrl": null,         
            "projection": null,         
            "queryable": true,         
            "server": {
                "class": "au.org.emii.portal.Server",         
                "id": 14,         
                "allowDiscoveries": false,         
                "comments": null,         
                "disable": false,         
                "imageFormat": "image/png",         
                "infoFormat": "text/html",         
                "lastScanDate": null,         
                "name": "IMOS Tile Cache",         
                "opacity": 100,         
                "operations": [],         
                "owners": [],         
                "password": null,         
                "scanFrequency": 120,         
                "shortAcron": "IMOS_Tile_Cache",         
                "type": "WMS-1.1.1",         
                "uri": "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",         
                "username": null
            },         
            "styles": null,         
            "title": "Bathymetry Baselayer",         
            "version": 0
        }
        
        layerStore.add(layerDesc);
        
//        expect(layerStore.getCount()).toBe(1);
    });
    
    
    // add open layer
    
    
    // remove layer descriptor - not sure that this is possible?
    
    // remove open layer
});
