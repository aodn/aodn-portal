/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {
        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls: 'steps'
            },
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch'
            }
        }, cfg);

        this.mapPanel = cfg.mapPanel;

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function (eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);
        
        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function (eventName, openlayer) {
            this.removeFromLayerCombo(openlayer);
        }, this);
    },

    initComponent: function () {
        this.detailsPanelTabs = new Portal.details.DetailsPanelTab({
            map: this.map
        });
       
        this.layerComboLabel = new Ext.form.Label({
            html: "<h4>" + OpenLayers.i18n('spatialExtentHeading') + "</h4>"
        });
        
        this.layerCombo = new Ext.form.ComboBox({
        	width: 130,
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,

            mode: 'local',
        	  store: new Ext.data.ArrayStore({
        	        id: 0,
        	        fields: [
        	            'id',
        	            'layer',
        	            'layerName'
        	        ]
        	    }),
        	    valueField: 'id',
        	    displayField: 'layerName',
        	    listeners: {
        	    	select: function(combo, record) {
        	            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, record.data.layer);
       	               }
        	    }
        });
        
        this.spacer = new Ext.Spacer({ height: 10 });
        
        this.items = [
            this.layerComboLabel,
            this.layerCombo,
            this.detailsPanelTabs
        ];

    
        Portal.details.DetailsPanel.superclass.initComponent.call(this);

        this.hideDetailsPanelContents();
    },

    // must be called when the panel is fully expanded for the slider
    updateDetailsPanel: function (layer, forceOpen) {
        if (layer) {

            if (layer.isOverlay()) {
                this.setLayerCombo(layer);
                // show new layer unless user requested 'hideLayerOptions'
                this.detailsPanelTabs.handleLayer(layer);
                this.doLayout();
            }
        }
        else {
            this.hideDetailsPanelContents();
        }
    },
    
    setLayerCombo: function(layer) {
    	if (this.layerCombo.store.find('id', layer.id) != -1) {
    		this.layerCombo.setValue(layer.name);
    	} else {
    		this.addTolayerCombo(layer);
    	};
    },

    
    addTolayerCombo: function(layer) {
    	var layerArray=new Array();
    	layerArray['id'] = layer.id;
    	layerArray['layerName'] = layer.name;
    	layerArray['layer'] = layer;
    	this.layerCombo.store.add(new Ext.data.Record(layerArray));
    	this.layerCombo.setValue(layer.name);
    },
    
    removeFromLayerCombo: function(layer) {
    	var index = this.layerCombo.store.find('id', layer.id);
    	if (index != -1) {
    		this.layerCombo.store.removeAt(index);
    	}
    },

    hideDetailsPanelContents: function () {
        // clear the details Panel. ie. Don't show any layer options

        //DO NOT HIDE THE opacitySlider directly, or you WILL break things.-Alex
        this.detailsPanelTabs.setVisible(false);
    },

    showDetailsPanelContents: function() {
        this.doLayout();
    }
});
