/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(cfg) {
        this.mainTabPanel = new Portal.ui.MainTabPanel({
            region: 'center',
            activeTab: cfg.activeTab
        });

        this.layerChooserPanel = new Portal.ui.LayerChooserPanel({
            region: 'west',
            appConfig: cfg.appConfig,
            mapPanel: this.mainTabPanel.getMapPanel()
            // width: cfg.appConfig.westWidth // Todo - DN: Max and min are specified in JS, should default be too?
        });

        var config = Ext.apply({
            layout: 'border',
            boxMinWidth: 1050,
            items: this._getItems(cfg) }, cfg);

        Portal.ui.Viewport.superclass.constructor.call(this, config);
    },

    _getItems: function(cfg) {
        return [
                {
                    unstyled: true,
                    region: 'north',
                    height: cfg.appConfig.headerHeight + 15
                },
                this.mainTabPanel,
                {
                    region: 'south',
                    height: 15,
                    unstyled: true
                },
                this.layerChooserPanel
        ];
    },

    initComponent: function() {
        Portal.ui.Viewport.superclass.initComponent.call(this);

        //TODO: find a better home for this
        this.on('afterrender', function() {
            jQuery("#loader").hide('slow'); // close the loader
        });

        this.layerChooserPanel.leftTabMenuPanel.on('afterrender', function () {
            this.doLayout(false, true);
        }, this);
    },

    setActiveTab: function(tabIndex) {
        this.mainTabPanel.setActiveTab(tabIndex);

        if (appConfigStore.isFacetedSearchEnabled() && (tabIndex == TAB_INDEX_SEARCH)) {
            this.layerChooserPanel.hide();
        }
        else {
            this.layerChooserPanel.show();
        }
        this.doLayout();
    },

    isMapVisible: function() {
        return this.mainTabPanel.isMapVisible();
    }
});
