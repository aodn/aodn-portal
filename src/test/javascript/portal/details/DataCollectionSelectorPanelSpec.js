/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DataCollectionSelectorPanelSpec", function() {

    var dataCollectionSelectorPanel;
    var openLayer;

    beforeEach(function() {
        dataCollectionSelectorPanel = new Portal.details.DataCollectionSelectorPanel();
        dataCollectionSelectorPanel.initComponent();
        spyOn(dataCollectionSelectorPanel, 'updateLayerComboBox');
        spyOn(dataCollectionSelectorPanel, 'removeFromLayerComboBox');

        openLayer = new OpenLayers.Layer.WMS("the title",
                "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
                {}, {
                    isBaseLayer : false
                });
    });

    describe('data collection added', function() {
        beforeEach(function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, openLayer);
        });

        it('adds a layer to combobox', function() {
            expect(dataCollectionSelectorPanel.updateLayerComboBox).toHaveBeenCalledWith(openLayer);
        });
    });

    describe('data collection removed', function() {
        beforeEach(function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, openLayer);
        });

        it('removes a layer from combobox', function() {
            expect(dataCollectionSelectorPanel.removeFromLayerComboBox).toHaveBeenCalledWith(openLayer);
        });
    });
});
