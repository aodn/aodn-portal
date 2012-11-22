
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.PortalPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.initMapPanel(cfg.appConfig);
        this.rightDetailsPanel = new Portal.ui.RightDetailsPanel({
			region: 'east',
			collapsible: true,
			collapsed: true,
			stateful: false
		});

        var config = Ext.apply({
            layout: 'border',
            id: 'mainMapPanel',
            title: 'Map',
            stateful: false,
            items: [
                {
                    region:'center',
                    id: 'mainMapCentrePanel',
                    layout:'border',
                    stateful: false,
                    items: [                
                        this.mapPanel
                    ]
                },
                this.rightDetailsPanel
            ]
        }, cfg);
	
        Portal.ui.PortalPanel.superclass.constructor.call(this, config);
        
        this.addEvents('tabchange');
        this.on('tabchange', function() {
        	this.mapPanel.fireEvent('tabchange');
        }, this);

    },
	
    initMapPanel: function(appConfig) {
        this.mapPanel = new Portal.ui.MapPanel({
            appConfig: appConfig
        });
    },

	getRightDetailsPanel: function() {
	    return this.rightDetailsPanel;
	},
	
	getMapPanel: function() {
		return this.mapPanel;
	}
});
