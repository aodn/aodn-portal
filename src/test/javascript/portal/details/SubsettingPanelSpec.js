/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsettingPanel", function() {

    var subsettingPanel;
    var dataCollection;
    var dataCollectionStore;

    beforeEach(function() {
        spyOn(Portal.details.SubsettingPanel.prototype, '_newSubsetPanelAccordion').andReturn(new Ext.Panel());

        dataCollectionStore = {
            getCount: noOp
        };

        dataCollection = {
            getSelectedLayer: noOp
        };

        subsettingPanel = new Portal.details.SubsettingPanel({
            map: new OpenLayers.SpatialConstraintMap(),
            dataCollectionStore: dataCollectionStore
        });

        spyOn(subsettingPanel, '_setEmptyNotificationVisible');
    });

    it('hides notification on collection added', function() {
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
        expect(subsettingPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(false);
    });

    it('shows notification on collection removed if no collections', function() {
        dataCollectionStore.getCount = returns(1);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
        expect(subsettingPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(false);

        dataCollectionStore.getCount = returns(0);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
        expect(subsettingPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(true);
    });

    it('show correct step title', function() {
        var expectedTitle = OpenLayers.i18n(
            'stepHeader',
            {
                stepNumber: 2,
                stepDescription: OpenLayers.i18n('step2Description')
            }
        );

        expect(subsettingPanel.title).toEqual(expectedTitle);
    });
});
