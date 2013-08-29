
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.VisualisePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.mapPanel = cfg.mapPanel;
        this.mapPanel.region = 'center';

        this.rightDetailsPanel = new Portal.ui.RightDetailsPanel({
			region: 'east',
			collapsible: true,
			collapsed: false,
			stateful: false
		});

        var config = Ext.apply({
            layout: 'border',
            id: 'visualisePanel',
            stateful: false,
            items: [
                this.mapPanel,
                this.rightDetailsPanel
            ]
        }, cfg);

        Portal.ui.VisualisePanel.superclass.constructor.call(this, config);

        this.on('beforehide', function() { this.onBeforeHide() }, this);
    },

    onBeforeHide: function() {

        this.mapPanel.beforeParentHide();
    }
});
