/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsetPanelAccordion", function() {

    var subsetPanelAccordion;

    beforeEach(function() {

        var layer = new OpenLayers.Layer.WMS();
        layer.server = {uri: "uri"};
        layer.getDownloadLayer = function() { return "downloadLayer"; };

        subsetPanelAccordion = new Portal.details.SubsetPanelAccordion({
            map: new OpenLayers.SpatialConstraintMap(),
            layer: layer,
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
            subsetPanelAccordion.layer.name = 'test layer';

            spyOn(window, 'trackUsage');
            subsetPanelAccordion._doTracking(subsetPanelAccordion, testNewTab, testOldTab);
            expect(window.trackUsage).toHaveBeenCalledWith('Details', 'Tabs', 'new tab', 'test layer');
        });
    });
});
