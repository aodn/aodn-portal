/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanelTab", function() {

    var detailsPanelTab;

    beforeEach(function() {

        spyOn(Portal.details.InfoPanel.prototype, '_initWithLayer');
        spyOn(Portal.details.StylePanel.prototype, '_initWithLayer');

        var layer = new OpenLayers.Layer.WMS();
        layer.server = { uri: "uri" };

        detailsPanelTab = new Portal.details.DetailsPanelTab({
            map: new OpenLayers.SpatialConstraintMap(),
            layer: layer
        });
    });

    describe('initialisation', function() {
        it('is tab panel', function() {
            expect(detailsPanelTab).toBeInstanceOf(Ext.TabPanel);
        });

        it('initialises subsetPanel', function() {
            expect(detailsPanelTab.subsetPanel).toBeInstanceOf(Portal.details.SubsetPanel);
            expect(detailsPanelTab.items.itemAt(0)).toBe(detailsPanelTab.subsetPanel);
        });
    });
});
