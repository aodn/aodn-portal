/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsetPanelAccordion", function() {

    var detailsPanelTab;

    beforeEach(function() {

        spyOn(Portal.details.InfoPanel.prototype, '_initWithLayer');
        spyOn(Portal.details.StylePanel.prototype, '_initWithLayer');

        detailsPanelTab = new Portal.details.SubsetPanelAccordion({
            map: new OpenLayers.SpatialConstraintMap(),
            layer: new OpenLayers.Layer.WMS(),
            mapPanel: new Portal.ui.MapPanel()
        });
    });

    describe('doTracking', function() {
        it('fires an analytics event', function() {
            var testOldTab = {
                title: 'old tab'
            };
            var testNewTab = {
                title: 'new tab'
            };
            detailsPanelTab.layer.name = 'test layer';

            spyOn(window, 'trackUsage');
            detailsPanelTab._doTracking(detailsPanelTab, testNewTab, testOldTab);
            expect(window.trackUsage).toHaveBeenCalledWith('Details', 'Tabs', 'new tab', 'test layer');
        });
    });
});
