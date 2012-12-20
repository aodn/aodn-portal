
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.LayerChooserPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.appConfig = cfg.appConfig;
        this.mapPanel = cfg.mapPanel;
        this.initLeftTabMenuPanel(this.appConfig);

        var config = Ext.apply({
            id: "leftMenus",
            width: 340,
            minWidth: 300,
            maxWidth: 460,
            margins : {left:5},
            padding: 4,
            collapsible: true,
            stateful: false,
            split: true,
            headerCfg:  {
                cls: 'menuHeader',
                html: 'Message'
            },
            title: OpenLayers.i18n('layerChooserMenuHeader'),
            layout: 'vbox',
            layoutConfig: {
              align: 'stretch'
            },
            autoScroll: true,
            items: [
                this.leftTabMenuPanel
            ],
            cls: 'leftMenus'
        }, cfg);

        Portal.ui.LayerChooserPanel.superclass.constructor.call(this, config);
    },

    initLeftTabMenuPanel: function(appConfig) {
        this.leftTabMenuPanel = new Portal.ui.MapMenuPanel({
            menuId: appConfig.defaultMenu.id
        });
    }
});
