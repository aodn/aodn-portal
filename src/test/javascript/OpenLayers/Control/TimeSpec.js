/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Control.Time", function() {

    var map;
    var timeControl;

    beforeEach(function() {
        map = new OpenLayers.TemporalMap();
        timeControl = new OpenLayers.Control.Time({
            map: map
        });
    });
    
    it("play", function() {
        spyOn(map, 'play');
        timeControl.play();
        expect(map.play).toHaveBeenCalled();
    });

    it("stop", function() {
        spyOn(map, 'stop');
        timeControl.stop();
        expect(map.stop).toHaveBeenCalled();
    });
});
