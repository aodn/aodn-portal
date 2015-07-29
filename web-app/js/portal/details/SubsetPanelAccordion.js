/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetPanelAccordion = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            cls: 'subsetPanelAccordion',
            layout: 'noncollapsingaccordion',
            autoScroll: true,
            layoutConfig: {
                animate: true,
                hideCollapseTool: true
            }
        }, cfg);

        Portal.details.SubsetPanelAccordion.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function(eventName, dataCollection) {
            this.add(this._newSubsetItemsWrapperPanel(dataCollection));
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function(eventName, dataCollection) {
            this.remove(dataCollection.getUuid());
        }, this);
    },

    _newSubsetItemsWrapperPanel: function(dataCollection) {
        return new Portal.details.SubsetItemsWrapperPanel({
            map: this.map,
            dataCollection: dataCollection,
            dataCollectionStore: this.dataCollectionStore,
            id: dataCollection.getUuid(),
            listeners: {
                expand: function (panel) {
                    Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, panel.layer);
                }
            }
        });
    }
});
