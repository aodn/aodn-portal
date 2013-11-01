/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.TemporalMap", function() {

    var map;
    
    beforeEach(function() {
        map = new OpenLayers.TemporalMap();
    });

    describe('toTime', function() {
        it('toTime called on layers ncWMS layers but not others', function() {
            var ncWmsLayer = new OpenLayers.Layer.NcWMS();
            var nonNcWmsLayer = new OpenLayers.Layer.WMS();

            map.addLayers([ncWmsLayer, nonNcWmsLayer]);

            var theDateTime = moment('2013-05-27T12:45:56');

            spyOn(ncWmsLayer, 'toTime');
            map.toTime(theDateTime);

            expect(ncWmsLayer.toTime).toHaveBeenCalledWith(theDateTime)
        });

        it('timechanged event when toTime is called', function() {
            var timechangedSpy = jasmine.createSpy('timechangedSpy');
            map.events.on({
                'timechanged': timechangedSpy
            });

            var dateTime = moment();
            map.toTime(dateTime);
            expect(timechangedSpy).toHaveBeenCalledWith(dateTime);
        });
    });
});
