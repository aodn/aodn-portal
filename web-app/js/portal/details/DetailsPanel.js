/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            typeLabel: OpenLayers.i18n('spatialExtentHeading'),
            map: cfg.map,
            hideLabel: false
        });

        this.layerDetailsAccordion = new Portal.details.SubsetPanelAccordion({
            map: cfg.map,
            mapPanel: cfg.mapPanel,
            bboxFilter: this.spatialSubsetControlsPanel
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls : 'steps'
            },

            items: [
                this.spatialSubsetControlsPanel,
                this.layerDetailsAccordion,
                new Ext.Spacer({height: 20})
            ]
        }, cfg);

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName, openlayer) {
            this._removeTabForLayer(openlayer);
        }, this);
    },

    updateDetailsPanel: function(layer) {
        if (layer) {
            if (!this._tabExistsForLayer(layer)) {
                this._addTabForLayer(layer);
            }
            this._activateTabForLayer(layer);
            this.layerDetailsAccordion.doLayout();
        }
    },

    _tabExistsForLayer: function(layer) {
        return this.layerDetailsAccordion.items.item(this._getTabIdForLayer(layer));
    },

    _addTabForLayer: function(layer) {

        var tabForLayer = new Portal.details.SubsetPanel( {
            id: this._getTabIdForLayer(layer),
            map: this.map,
            mapPanel: this.mapPanel,
            layer: layer
        });
        this.layerDetailsAccordion.add(tabForLayer);
    },

    _activateTabForLayer: function(layer) {
        this.layerDetailsAccordion.layout.setActiveItem(this._getTabIdForLayer(layer));
        this.layerDetailsAccordion.doLayout();
    },

    _removeTabForLayer: function(layer) {
        if (this._tabExistsForLayer(layer)) {
            this.layerDetailsAccordion.remove(this._getTabIdForLayer(layer));
        }
    },

    _getTabIdForLayer: function(layer) {
        return layer.id + '_detailsPanel';
    }
});
