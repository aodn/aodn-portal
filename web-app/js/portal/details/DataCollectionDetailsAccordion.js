
Ext.namespace('Portal.details');

Portal.details.DataCollectionDetailsAccordion = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            cls: 'dataCollectionDetailsAccordion',
            layout: 'noncollapsingaccordion',
            autoScroll: true,
            layoutConfig: {
                animate: true,
                hideCollapseTool: true
            }
        }, cfg);

        Portal.details.DataCollectionDetailsAccordion.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function(eventName, dataCollection) {
            this.add(this._newDataCollectionDetailsPanel(dataCollection));
            this.doLayout();  // This seems to be required in order to first collapse all folders.
            this.setActiveItem(dataCollection.getUuid());
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function(eventName, dataCollection) {
            this.remove(dataCollection.getUuid());
        }, this);
    },

    setActiveItem: function(itemId) {
        this.layout.setActiveItem(itemId);
    },

    _newDataCollectionDetailsPanel: function(dataCollection) {
        return new Portal.details.DataCollectionDetailsPanel({
            map: this.map,
            dataCollection: dataCollection,
            dataCollectionStore: this.dataCollectionStore,
            id: dataCollection.getUuid()
        });
    }
});
