/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsettingPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        this.map = cfg.map;
        this.mapPanel = cfg.mapPanel;

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: cfg.map,
            hideLabel: false
        });

        this.subsetPanelAccordion = new Portal.details.SubsetPanelAccordion();

        this.emptyTextPanel =  new Portal.common.EmptyCollectionStatusPanel({
            hidden: true
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
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

        Portal.details.SubsettingPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateSubsetPanelAccordionItem(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName, openlayer) {
            this._removeFolderForLayer(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, function(eventName, message) {
            this._updateItemOrder(message);
        }, this);
    },


    updateSubsetPanelAccordionItem: function(layer) {
        if (layer) {
            if (!this._itemExistsForLayer(layer)) {
                this._addItemForLayer(layer);
            }
            this._activateItemForLayer(layer);
        }
    },

    _itemExistsForLayer: function(layer) {
        return (this.subsetPanelAccordion.items.item(this._getItemIdForLayer(layer)) != undefined) ;
    },

    _addItemForLayer: function(layer) {

        var layerContainer = new Portal.details.SubsetItemsWrapperPanel({
            map: this.map,
            layer: layer,
            layerItemId: this._getItemIdForLayer(layer)
        });

        this.subsetPanelAccordion.add(layerContainer);
        this.subsetPanelAccordion.doLayout();
        this.emptyTextPanel.hide();
    },

    _activateItemForLayer: function(layer) {

        if (this._itemExistsForLayer(layer)) {
            this.subsetPanelAccordion.layout.setActiveItem(this._getItemIdForLayer(layer));
            this.subsetPanelAccordion.items.item(this._getItemIdForLayer(layer)).expand();
        }
    },

    _updateItemOrder: function(message) {

        var movingItemIndex = this.subsetPanelAccordion.items.keys.indexOf(this._getItemIdForLayer(message.layer));
        var newIndex = message.direction + movingItemIndex;

        var itemToMove = this.subsetPanelAccordion.getComponent(movingItemIndex);
        this.subsetPanelAccordion.remove(itemToMove, false);
        this.subsetPanelAccordion.insert(newIndex, itemToMove);
        this.subsetPanelAccordion.layout.setActiveItem(this._getItemIdForLayer(message.layer));

        // Do the actual DOM maniplulation with jQuery. Extjs3.4 wont/cant
        var siblings = jQuery('#' + itemToMove.id).parent().children();
        var targetSibling = siblings.eq(newIndex);
        var movingSibling = siblings.eq(movingItemIndex);

        movingSibling.fadeOut(300, function() {
            if (message.direction > 0) {
                targetSibling.after(movingSibling);
            }
            else {
                targetSibling.before(movingSibling);
            }
            movingSibling.fadeIn(50);
        });
    },

    _removeFolderForLayer: function(layer) {
        if (this._itemExistsForLayer(layer)) {
            this.subsetPanelAccordion.remove(this._getItemIdForLayer(layer));
        }
        this.checkState();
    },

    checkState: function() {
        if (this.subsetPanelAccordion.items.length == 0) {
            this.emptyTextPanel.show();
        }
    },

    _getItemIdForLayer: function(layer) {
        return layer.id + '_subsettingPanel';
    }
});
