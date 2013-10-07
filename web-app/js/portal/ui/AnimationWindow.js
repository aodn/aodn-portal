/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.AnimationWindow = Ext.extend(Ext.Window, {

    constructor: function(cfg) {
        this.animationControlsPanel = new Portal.details.AnimationControlsPanel({
            mapPanel: cfg.mapPanel
        });

        this.toggleVisibilityButton = new Ext.Button({
            cls: 'animationSubPanel',
            margins: '4px',
            iconCls: 'arrowUpWhite',
            ref: 'controlButton',
            iconAlign: 'right',
            text: OpenLayers.i18n('controlButton_4AnimationControlsPanel')
        });

        var config = Ext.apply({
            cls: 'animationWindow semiTransparent',
            padding: '2px 0px 0px 250px',
            layout: 'hbox',
            items:  [
                this.animationControlsPanel,
                this.toggleVisibilityButton
            ],
            border: false,
            bodyBorder: false,
            closable: false,
            draggable: false,
            frame: false,
            header: false,
            resizable: false,
            shadow: false
        }, cfg);

        Portal.ui.AnimationWindow.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this.hide();
        }, this);

        this._contract();

        this.toggleVisibilityButton.on('click', this._onToggleVisibilityClicked, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, this._onSelectedLayerChanged, this);
    },

    _onSelectedLayerChanged: function(eventName, openLayer) {
        if (openLayer && openLayer.isAnimatable()) {
            this.show();
        } else {
            this.hide();
        }
    },

    _onToggleVisibilityClicked: function() {
        if (this._expanded) {
            this._contract();
        } else {
            this._expand();
        }
    },

    _expand: function() {
        this._reLayout({
            animationControlsPanelDelegate: this.animationControlsPanel.expand,
            iconClass: 'arrowDownWhite',
            expanded: true
        });
    },

    _contract: function() {
        this._reLayout({
            animationControlsPanelDelegate: this.animationControlsPanel.contract,
            iconClass: 'arrowUpWhite',
            expanded: false
        });
    },

    _reLayout: function(params) {
        params.animationControlsPanelDelegate.call(this.animationControlsPanel);
        this.toggleVisibilityButton.setIconClass(params.iconClass);
        this._expanded = params.expanded;

        // This call is necessary because child components are being shown or hidden.
        this.doLayout();
    }
});
