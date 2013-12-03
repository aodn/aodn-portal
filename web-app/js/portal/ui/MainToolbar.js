/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MainToolbar = Ext.extend(Ext.Toolbar, {

    constructor: function(cfg) {

        this.mainPanel = cfg.mainPanel;

        this.prevButton = new Ext.Button({
            cls: "navigationButton backwardsButton",
            text: OpenLayers.i18n('navigationButtonPrevious'),
            width: 100,
            hidden: true
        });
        this.prevButton.on('click', function() {
            this.mainPanel.layout.navigateToPrevTab();
        }, this);

        this.nextButton = new Ext.Button({
            cls: "navigationButton forwardsButton",
            width: 100,
            text: OpenLayers.i18n('navigationButtonNext'),
            hidden: true
        });
        this.nextButton.on('click', function() {
            this.mainPanel.layout.navigateToNextTab();
        }, this);


        var config = Ext.apply({
            height: 35,
            items: [
                this.prevButton,
                this.nextButton,
                '->',
                {
                    xtype: 'panel',
                    html: OpenLayers.i18n('footerText'),
                    unstyled: true,
                    cls: 'footerText'
                }
            ]
        }, cfg);

        Portal.ui.MainToolbar.superclass.constructor.call(this, config);

        this._registerEvents();
    },

    _registerEvents: function() {
        this.mainPanel.on('tabchange', this._renderNavigationButtons, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(subject, openLayer) {
            this._renderNavigationButtons(this.mainPanel);
        }, this);
    },

    _renderNavigationButtons: function(mainPanel) {
        this.prevButton.setVisible(mainPanel.layout.hasPrevTab());

        // Next button will be visible only if data collections were loaded to
        // the map
        this.nextButton.setVisible(
            mainPanel.layout.hasNextTab() &&
            Portal.data.ActiveGeoNetworkRecordStore.instance().getCount() > 0);

        this.prevButton.setText(mainPanel.layout.getPrevNavigationLabel());
        this.nextButton.setText(mainPanel.layout.getNextNavigationLabel());

        // Smells, but since we might hide/show buttons and the object is
        // already rendered, we will need the doLayout() call
        this.doLayout();
    }
});
