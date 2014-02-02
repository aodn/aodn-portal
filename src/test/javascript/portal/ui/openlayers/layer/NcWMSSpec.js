/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.ui.openlayers.layer.NcWMS', function() {
    describe('getCqlForTemporalExtent', function() {
        it('constructs CQL', function() {

            var ncwmsLayer = new OpenLayers.Layer.NcWMS('name', 'url', {}, {}, {});
            var startTime = moment('2000-01-01T01:01:01Z');
            var endTime = moment('2001-01-01T01:01:01Z');

            ncwmsLayer.bodaacFilterParams = {
                dateRangeStart: startTime,
                dateRangeEnd: endTime
            };

            expect(ncwmsLayer.getCqlForTemporalExtent()).toEqual(
                'time%20%3E%3D%202000-01-01T01%3A01%3A01.000Z%20and%20time%20%3C%3D%202001-01-01T01%3A01%3A01.000Z'
            );
        });
    });
});
