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
            region: 'center'
        });

        this.layerChooserPanel = new Portal.ui.LayerChooserPanel({
            region: 'west',
            appConfig: cfg.appConfig,
            mapPanel: this.mainTabPanel.getMapPanel()
            // width: cfg.appConfig.westWidth // Todo - DN: Max and min are specified in JS, should default be too?
        });

        this.config = Ext.apply({
            layout: 'border',
            boxMinWidth: 1050,
            items: [
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

            ]}, cfg);

        Portal.ui.Viewport.superclass.constructor.call(this, this.config);
    },

    initComponent: function() {
        Portal.ui.Viewport.superclass.initComponent.call(this);

        //TODO: find a better home for this
        this.on('afterrender', function() {
            jQuery("#loader").hide('slow'); // close the loader

            if(window.location.search.length > 0){

                Ext.Msg.show({
                    title: "<h2>Disclaimer</h2>",
                    buttons: Ext.Msg.OK,
                    cls: 'motd',
                    width: 600,
                    msg: this.config.appConfig.footerContent
                });

                this.setActiveTab('map');

                var regPattern = new RegExp(/\?savedMapId=([0-9]+)/);
                var matches = regPattern.exec(window.location.search);

                if(matches != null && matches.length == 2){
                    this.setActiveTab( 1 );
                    //show the map
                    console.log(matches[1]);
                    this.showSnapshot(matches[1]);
                }
                else{
                    //show the homepage
                    this.setActiveTab( 0 ); // Select default tab
                }
            }
        }, this);
    },

    setActiveTab: function(tabIndex) {
        this.mainTabPanel.setActiveTab(tabIndex);
    },

    isMapVisible: function() {
        return this.mainTabPanel.isMapVisible();
    },

    showSnapshot: function(id) {
        this.mainTabPanel.loadSnapshot(id);
    }
});
