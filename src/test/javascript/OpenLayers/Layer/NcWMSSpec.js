/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.NcWMS", function() {

    var ncwmsLayer;
    
    beforeEach(function() {
        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };
        ncwmsLayer = new OpenLayers.Layer.NcWMS();
    });
    
    it("getURL includes 'time' parameter", function() {

        var time = moment('2011-07-08T03:32:45Z');
        
        ncwmsLayer.toTime(time);
        expect(ncwmsLayer.getURL(new OpenLayers.Bounds({
            left: 0,
            right: 10,
            top: 0,
            bottom: 10
        })).split('&')).toContain('TIME=' + time.format());
    });
});
