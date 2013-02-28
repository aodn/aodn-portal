
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

// TODO: add something here to hide/show 'no layer selected' if there are no
// active layers on the map
Portal.ui.RightDetailsPanel = Ext.extend(Ext.Panel, {

	constructor : function(cfg) {
		var config = Ext.apply({
					id : 'rightDetailsPanel',
					region : 'east',
					title : OpenLayers.i18n('noActiveLayersSelected'),
					stateful : false,
					padding : '10px 10px 5px 20px',
					split : true,
					width: 360,
					minWidth : 320,
					maxWidth : 500,
					layout : 'fit',
                    collapseMode: 'header'
				}, cfg);

		Portal.ui.RightDetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe('selectedLayerChanged', function(subject, openLayer) {
            this.selectedLayer = openLayer;

            if (this.rendered) {
                this.update(this.selectedLayer);
            }
            else {
                this.on('afterlayout', this._delayedAddFirstLayer);
            }
        }, this);

        Ext.MsgBus.subscribe('hideLayerDetailsCheck', function (subject, checkBox) {
            if (checkBox.checked) {
                this.hideLayerDetailsChecked = true;
                this.collapse();
            }
            else {
                this.hideLayerDetailsChecked = false;
                this.expand();
            }
        }, this);
	},

    initComponent: function() {
        this.detailsPanelItems = new Portal.details.DetailsPanel();

        this.items = [this.detailsPanelItems];

        this.detailsPanelItems.hideDetailsPanelContents();
        Portal.ui.RightDetailsPanel.superclass.initComponent.call(this);
        this.on("expand", function() {
            this.update(this.selectedLayer);
        }, this);
    },

    expand: function(animate) {
        if (this.hideLayerDetailsChecked) {
            return this;
        }
        return Portal.ui.RightDetailsPanel.superclass.expand.call(this, arguments);
    },

    _delayedAddFirstLayer: function() {
        this.un('afterlayout', this._delayedAddFirstLayer);
        // The panel believes it is expanded so we have to trick it into thinking it's collapsed
        this.collapsed = true;
        this.update(this.selectedLayer);
    },

	getDetailsPanelItems: function() {
		return this.detailsPanelItems;
	},

	// A new layer has been added or selected ("openlayer" may be null, e.g. when "Remove All Layers"
	// has been clicked).
	update: function(openlayer) {
		this.selectedLayer = openlayer;
		
		if (openlayer) {
    		if (openlayer.map == null)
    		{
    			return;
    		}
    		
    		this.text = openlayer.name;
    		this.setTitle(openlayer.name);
    		if (this.hideLayerDetailsChecked) {
                this.collapse(true);
    		}
            else {
                this.collapsed ? this.expand() : this.detailsPanelItems.updateDetailsPanel(openlayer);
    		}
		}
		else {
		    this.collapseAndHide();
		}
	},

	// call only when there are no layers in the map
	collapseAndHide : function() {
		this.setTitle(OpenLayers.i18n('noActiveLayersSelected'));
		this.collapse(true);
		this.detailsPanelItems.hideDetailsPanelContents();
	}
});
