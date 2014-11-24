/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsetPanel", function() {

    var layer;
    var map;
    var subsetPanel;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();
        layer = new OpenLayers.Layer.NcWMS(
            'the title',
            'http://someaddress',
            {},
            {},
            { extent: ['2014-01-01T10:00:00'] }
        );
        layer.map = map;

        subsetPanel = new Portal.details.SubsetPanel({
            map: map,
            layer: layer
        });
    });

    describe('initialisation', function() {

        it('sets title', function() {
            expect(subsetPanel.title).toEqual(OpenLayers.i18n('subsetPanelTitle'));
        });

        it('initialises ncwmsPanel for NcWMS layer', function() {

            var childPanel = subsetPanel.items.itemAt(0);

            expect(childPanel).toBeInstanceOf(Portal.details.NcWmsPanel);
            expect(childPanel.map).toBe(map);
            expect(childPanel.title).toBeUndefined();
       });
    });
});
