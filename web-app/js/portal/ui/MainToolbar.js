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
            text: '<< prev',
            disabled: true
        });
        this.prevButton.on('click', function() {
            this.mainPanel.layout.navigateToPrevTab();
        }, this);

        this.nextButton = new Ext.Button({
            text: 'next >>'
        });
        this.nextButton.on('click', function() {
            this.mainPanel.layout.navigateToNextTab();
        }, this);

        var config = Ext.apply({
            items: [
                this.prevButton,
                this.nextButton
            ]
        }, cfg);

        Portal.ui.MainToolbar.superclass.constructor.call(this, config);

        this.mainPanel.on('tabchange', this._onMainPanelTabChange, this);
    },

    _onMainPanelTabChange: function(mainPanel) {
        this.prevButton.setDisabled(!mainPanel.layout.hasPrevTab());
        this.nextButton.setDisabled(!mainPanel.layout.hasNextTab());
    }
});
