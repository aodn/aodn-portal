
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.openlayers.MapOptions", function() {

    var mapOptions;
    var map;

    beforeEach(function() {

        // Configure map options
        var mapPanel = {
            add: jasmine.createSpy()
        };

        mapOptions = new Portal.ui.openlayers.MapOptions({}, mapPanel);

        // Create new map
        map = mapOptions.newMap();
    });

    describe('newMap()', function() {

        it('construct temporal map', function() {
            expect(map.CLASS_NAME).toBe('OpenLayers.TemporalMap');
        });

        it('time control added to map', function() {
            expect(map.getControlsByClass("OpenLayers.Control.Time")[0]).toBeTruthy();
        });
        
        it('Should return map with bounds set as 90 and -90 for latitude', function() {

            expect(map.restrictedExtent).not.toBe(null);
            expect(map.restrictedExtent.top).toBe(90);
            expect(map.restrictedExtent.bottom).toBe(-90);
        });
    });
});
