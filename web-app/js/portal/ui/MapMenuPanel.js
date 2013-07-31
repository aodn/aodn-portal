/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapMenuPanel = Ext.extend(Ext.TabPanel, {

    constructor:function (cfg) {

        var itemsToAdd = [];

        this.defaultMenuTree = new Portal.ui.MenuPanel({
            menuId:cfg.menuId
        });
        itemsToAdd.push(this.defaultMenuTree);

        this.userDefinedWMSPanel = new Portal.ui.UserDefinedWMSPanel({});
        itemsToAdd.push(this.userDefinedWMSPanel);

        var config = Ext.apply({
            defaults:{
                //padding: 5,
                autoScroll:true
            },
            stateful:false,
            flex:1,
            border:false,
            enableTabScroll:true,
            activeTab:0,
            items:itemsToAdd
        }, cfg);

        Portal.ui.MapMenuPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe('selectedLayerChanged', function(subject,openLayer) {
            if (openLayer) {
                // so now parse tree and deactivate layers create from search
                var rootNode = this.defaultMenuTree.defaultNode();
                this.defaultMenuTree.toggleLayerNodes(openLayer.grailsLayerId,false,rootNode);
            }
        }, this);
        Ext.MsgBus.subscribe('layerRemoved', function(subject, message) {
            this.layerRemoved(message);
        }, this);
        Ext.MsgBus.subscribe('removeAllLayers', function(subject, message) {
            this.resetTree();
        }, this);
        Ext.MsgBus.subscribe('reset', function(subject, message) {
            this.resetTree(true);
        }, this);

        this.addEvents('addlayerclicked');

        this.relayEvents(this.defaultMenuTree, ['click', 'serverloaded']);
        this.registerMonitoringEvents();
    },

    toggleNodeBranch:function (enable, node) {
        this.defaultMenuTree.toggleNodeBranch(enable, node);
    },

    toggleLayerNodes:function (id, enable, node) {
        this.defaultMenuTree.toggleLayerNodes(id, enable, node);
    },

    resetTree:function (collapse) {
        this.defaultMenuTree.resetTree(collapse);
    },

    registerMonitoringEvents: function() {
        this.mon(this, 'click', this.onMenuNodeClick, this);
    },

    onMenuNodeClick: function(node) {
        if (node.attributes.grailsLayerId) {
            this.fireEvent('addlayerclicked');

            Portal.data.LayerStore.instance().addUsingServerId({
                id: node.attributes.grailsLayerId
            });
        }
    },

    layerRemoved: function(openLayer) {
        this.toggleLayerNodes(openLayer.grailsLayerId, true);
    }

});

Ext.reg('portal.ui.mapmenupanel', Portal.ui.MapMenuPanel);
