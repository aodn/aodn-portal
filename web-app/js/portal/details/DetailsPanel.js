/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(
            Ext.apply({
                style: {padding:'10px 20px 10px 5px'}
            }, cfg)
        );
        this.activeLayersContainer = new Ext.Panel({
            items: [
                this.activeLayersPanel
            ]
        });

        this.layerDetailsPanel = new Ext.Container({
            layout: 'card',
            ctCls: "overflow-y"
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls : 'steps'
            },

            items: [
                new Ext.Spacer({height: 20}),
                this.activeLayersContainer,
                new Ext.Spacer({height: 10}),
                this.layerDetailsPanel
            ]
        }, cfg);

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName, openlayer) {
            this._removeCardForLayer(openlayer);
        }, this);
    },

    updateDetailsPanel: function(layer) {
        if (layer) {
            if (!this._cardExistsForLayer(layer)) {
                this._addCardForLayer(layer);
            }
            this._activateCardForLayer(layer);
            this.layerDetailsPanel.show();
        }
        else {
            this.layerDetailsPanel.hide();
        }
    },

    _cardExistsForLayer: function(layer) {
        return this.layerDetailsPanel.items.item(this._getCardIdForLayer(layer));
    },

    _addCardForLayer: function(layer) {
        var cardForLayer = new Portal.details.DetailsPanelTab({
            id: this._getCardIdForLayer(layer),
            map: this.map,
            mapPanel: this.mapPanel,
            layer: layer
        });
        this.layerDetailsPanel.add(cardForLayer);
    },

    _activateCardForLayer: function(layer) {
        this.layerDetailsPanel.layout.setActiveItem(this._getCardIdForLayer(layer));
    },

    _removeCardForLayer: function(layer) {
        if (this._cardExistsForLayer(layer)) {
            this.layerDetailsPanel.remove(this._getCardIdForLayer(layer));
        }
    },

    _getCardIdForLayer: function(layer) {
        return layer.id + '_detailsPanel';
    }
});
