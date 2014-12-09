/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.DownloadCartWidget = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.buildComponents();

        var config = Ext.apply({
            id: "downLoadCartWidget",
            hidden: true,
            defaults: {
                autoEl: 'span'
            },
            items: [
                this.counterIcon,
                this.counterContainer
            ],
            listeners: {
                render: function(c) {
                    var that = this;
                    c.body.on('click', function() {
                        that.openDownloadTab();
                    });
                }
            }
        }, cfg);

        Portal.ui.DownloadCartWidget.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, function() {
            this.collectionCounter ++;
            this.updateDownloadCartSize();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED, function() {
            this.collectionCounter --;
            this.updateDownloadCartSize();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this.collectionCounter = 0;
            this.updateDownloadCartSize();
        }, this);
    },

    updateDownloadCartSize: function() {

        if (this.downloadCartSize.rendered) { // check for tests
            this.downloadCartSize.update(this.getCollectionCounterAsString());
            this.showHide();
        }
    },

    showHide: function() {
        (this.collectionCounter > 0) ? this.show() : this.hide();
    },

    getCollectionCounterAsString: function() {
        return String(this.collectionCounter);
    },

    openDownloadTab: function() {
        trackUsage('Navigation', 'Step 3 (cart button)');
        viewport.setDownloadTab();
    },

    buildComponents: function() {

        this.collectionCounter = 0;

        this.counterIcon = new Ext.Container({
            cls: 'cartLogo',
            html: '&nbsp;'
        });

        this.downloadCartSize = new Ext.Container({
            id: "downloadCartSize",
            html: this.getCollectionCounterAsString()
        });
        this.counterContainer = new Ext.Container({
            defaults: {
                autoEl: 'span'
            },
            items: [
                this.downloadCartSize,
                {
                    html: "item(s)"
                }
            ]
        });
    }
});
