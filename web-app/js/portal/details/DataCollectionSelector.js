/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DataCollectionSelector = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {

        var config = Ext.apply({

        }, cfg);
        Portal.ui.ActionsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(
                eventName, openlayer) {
            this.addToLayerCombo(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(eventName,
                openlayer) {
            this.removeFromLayerCombo(openlayer);
        }, this);

    },

    initComponent : function() {

        this.spacer = new Ext.Spacer({
            height : 10
        });

        this.layerCombo = new Ext.form.ComboBox({
            width : 235,
            typeAhead : true,
            triggerAction : 'all',
            lazyRender : true,
            mode : 'local',
            store : new Ext.data.ArrayStore({
                id : 0,
                fields : [ 'id', 'layer', 'layerName' ]
            }),
            valueField : 'id',
            editable : false,
            displayField : 'layerName',
            listeners : {
                select : function(combo, record) {
                    Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED,
                            record.data.layer);
                }
            }
        });

        this.items = [ this.spacer, this.layerCombo ];

        Portal.details.DataCollectionSelector.superclass.initComponent
                .call(this);

    },

    addToLayerCombo : function(layer, forceOpen) {
        if (layer) {
            if (layer.isOverlay()) {
                this.setLayerCombo(layer);
            }
        }
    },

    setLayerCombo : function(layer) {
        if (this.layerCombo.store.find('id', layer.id) != -1) {
            this.layerCombo.setValue(layer.name);
        } else {
            this.addTolayerCombo(layer);
        }
        ;
    },

    addTolayerCombo : function(layer) {
        var layerArray = new Array();
        layerArray['id'] = layer.id;
        layerArray['layerName'] = layer.name;
        layerArray['layer'] = layer;
        this.layerCombo.store.add(new Ext.data.Record(layerArray));
        this.layerCombo.setValue(layer.name);
    },

    removeFromLayerCombo : function(layer) {
        var index = this.layerCombo.store.find('id', layer.id);
        if (index != -1) {
            this.layerCombo.store.removeAt(index);
        }
    }

});
