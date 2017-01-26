Ext.namespace('Portal.ui');

Portal.ui.MainToolbar = Ext.extend(Ext.Toolbar, {

    constructor: function(cfg) {

        this.mainPanel = cfg.mainPanel;

        this.prevButton = new Ext.Button({
            cls: "navigationButton backwardsButton",
            text: OpenLayers.i18n('navigationButtonPrevious',{label: "Previous"}),
            width: 100,
            hidden: true
        });
        this.prevButton.on('click', function() {
            if (this.mainPanel.layout.navigateToPrevTab()) {
                this._doTrackUsage();
            }
        }, this);

        this.nextButton = new Ext.Button({
            cls: "navigationButton forwardsButton",
            width: 100,
            text: OpenLayers.i18n('navigationButtonNext', {label: "Next"}),
            hidden: true
        });
        this.nextButton.on('click', function() {
            if (this.mainPanel.layout.navigateToNextTab()) {
                this._doTrackUsage();
            }
        }, this);

        var config = Ext.apply({
            height: 35,
            items: [
                this.prevButton,
                this.nextButton,
                '->',
                {
                    xtype: 'container',
                    unstyled: true,
                    cls: "mainToolBarFooter",
                    html: "<div id='footerContent'></div>"
                }
            ]
        }, cfg);

        Portal.ui.MainToolbar.superclass.constructor.call(this, config);

        this._registerEvents();

        this._getMainToolBarLinksHtml();
    },

    // call after a navigation event
    _doTrackUsage: function() {
        var newStep = OpenLayers.i18n('navigationTrackingStepPrefix') + (this.mainPanel.layout.getActiveItemIndex() + 1);
        trackNavigationUsage('navigationTrackingNavigationButtonsAction', newStep);
    },

    _getMainToolBarLinksHtml: function() {
        Ext.Ajax.request({
            url: 'search/footerContent',
            scope: this,
            success: function(resp) {
                $("#footerContent").html(resp.responseText);
            },
            failure: function() {
                log.debug("Failed to obtain external links from server");
            }
        });
    },

    _registerEvents: function() {
        this.mainPanel.on('tabchange', this._renderNavigationButtons, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function() {
            this._renderNavigationButtons(this.mainPanel);
        }, this);
    },

    _renderNavigationButtons: function(mainPanel) {
        this.prevButton.setVisible(mainPanel.layout.hasPrevTab());

        // Next button will be visible only if data collections were loaded to
        // the map
        this.nextButton.setVisible(
            mainPanel.layout.hasNextTab() &&
            this.dataCollectionStore.getCount() > 0);

        this.prevButton.setText(mainPanel.layout.getPrevNavigationLabel());
        this.nextButton.setText(mainPanel.layout.getNextNavigationLabel());

        // Smells, but since we might hide/show buttons and the object is
        // already rendered, we will need the doLayout() call
        this.doLayout();
    }
});
