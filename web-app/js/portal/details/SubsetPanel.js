Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.dataCollectionDetailsAccordion = this._newDataCollectionDetailsAccordion(cfg);

        this.emptyTextPanel =  new Portal.common.EmptyCollectionStatusPanel({
            hidden: true
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n(
                'stepHeader',
                {
                    stepNumber: 2,
                    stepDescription: OpenLayers.i18n('step2Description')
                }
            ),
            headerCfg: {
                cls : 'steps'
            },

            items: [
                new Ext.Spacer({height: 5}),
                cfg.globalGeometryFilterPanel,
                this.dataCollectionDetailsAccordion,
                new Ext.Spacer({height: 20}),
                this.emptyTextPanel
            ]
        }, cfg);

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function(eventName, dataCollection) {
            this._setEmptyNotificationVisible(false);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function(eventName, dataCollection) {
            this._setEmptyNotificationVisible(this.dataCollectionStore.getCount() == 0);
        }, this);
    },

    _newDataCollectionDetailsAccordion: function(cfg) {
        return new Portal.details.DataCollectionDetailsAccordion({
            map: cfg.map,
            dataCollectionStore: cfg.dataCollectionStore
        });
    },

    _setEmptyNotificationVisible: function(show) {
        show ? this.emptyTextPanel.show() : this.emptyTextPanel.hide();
    }
});
