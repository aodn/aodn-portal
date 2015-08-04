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

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function() {
            this.collectionCounter ++;
            this.updateDownloadCartSize();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function() {
            this.collectionCounter --;
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
        trackNavigationUsage(
            'navigationTrackingCartButtonAction',
            OpenLayers.i18n('navigationTrackingStepPrefix') + '3'
        );
        viewport.setDownloadTab();
    },

    buildComponents: function() {

        this.collectionCounter = 0;

        this.counterIcon = new Ext.Container({
            cls: 'carticon',
            html: OpenLayers.i18n('carticon')
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
