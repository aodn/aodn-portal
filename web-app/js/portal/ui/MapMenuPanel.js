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

        if (appConfigStore.getById('facetedSearch.enabled').data.value) {

            this.selectionPanel = new Portal.ui.SelectionPanel({
                title:'Faceted Search',
                appConfig:Portal.app.config,
                split:true,
                searchRestriction:{
                    protocols:Portal.app.config.metadataLayerProtocols.split("\n").join(' or ')
                },
                searchTabTitle:OpenLayers.i18n('layerSearchTabTitle')
            });
            itemsToAdd.push(this.selectionPanel);
        }

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

        this.relayEvents(this.defaultMenuTree, ['click', 'serverloaded']);
    },

    toggleNodeBranch:function (enable, node) {
        this.defaultMenuTree.toggleNodeBranch(enable, node);
    },

    toggleLayerNodes:function (id, enable, node) {
        this.defaultMenuTree.toggleLayerNodes(id, enable, node);
    },
    resetTree:function (collapse) {
        this.defaultMenuTree.resetTree(collapse);
    }
});

Ext.reg('portal.ui.mapmenupanel', Portal.ui.MapMenuPanel);