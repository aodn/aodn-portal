/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: cfg.map,
            hideLabel: false
        });

        this.subsetPanelAccordion = this._newSubsetPanelAccordion(cfg);

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
                this.spatialSubsetControlsPanel,
                this.subsetPanelAccordion,
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

    _newSubsetPanelAccordion: function(cfg) {
        return new Portal.details.SubsetPanelAccordion({
            map: cfg.map,
            dataCollectionStore: cfg.dataCollectionStore
        });
    },

    _setEmptyNotificationVisible: function(show) {
        show ? this.emptyTextPanel.show() : this.emptyTextPanel.hide();
    }
});
