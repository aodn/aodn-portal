describe("Portal.details.SubsetPanel", function() {

    var subsetPanel;
    var dataCollection;
    var dataCollectionStore;

    beforeEach(function() {
        spyOn(Portal.details.SubsetPanel.prototype, '_newDataCollectionDetailsAccordion').andReturn(new Ext.Panel());

        dataCollectionStore = {
            getCount: noOp
        };

        dataCollection = {
            getSelectedLayer: noOp
        };

        subsetPanel = new Portal.details.SubsetPanel({
            map: new OpenLayers.SpatialConstraintMap(),
            dataCollectionStore: dataCollectionStore,
            globalGeometryFilterPanel: {}
        });

        spyOn(subsetPanel, '_setEmptyNotificationVisible');
    });

    it('hides notification on collection added', function() {
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
        expect(subsetPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(false);
    });

    it('shows notification on collection removed if no collections', function() {
        dataCollectionStore.getCount = returns(1);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
        expect(subsetPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(false);

        dataCollectionStore.getCount = returns(0);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
        expect(subsetPanel._setEmptyNotificationVisible).toHaveBeenCalledWith(true);
    });

    it('show correct step title', function() {
        var expectedTitle = OpenLayers.i18n(
            'stepHeader',
            {
                stepNumber: 2,
                stepDescription: OpenLayers.i18n('step2Description')
            }
        );

        expect(subsetPanel.title).toEqual(expectedTitle);
    });
});
