/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.DownloadConfirmationWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        // Content
        var contentPanel = new Ext.Panel({
            html: Portal.app.config.downloadCartConfirmationWindowContent,
            width: 450,
            resizable: false
        });

        // Controls
        this.downloadButton = new Ext.Button({
            text: OpenLayers.i18n('downloadConfirmationDownloadText'),
            listeners: {
                scope: this,
                click: this.onAccept
            }
        });

        var cancelButton = new Ext.Button({
            text: OpenLayers.i18n('downloadConfirmationCancelText'),
            listeners: {
                scope: this,
                click: this.onCancel
            }
        });

        this.downloadEmailPanel = new Portal.cart.DownloadEmailPanel({
            listeners: {
                scope: this,
                'valid': function() {
                    if (this.downloadEmailPanel.isVisible()) {
                        this.downloadButton.enable()
                    }
                },
                'invalid': function() {
                    if (this.downloadEmailPanel.isVisible()) {
                        this.downloadButton.disable()
                    }
                }
            }
        });

        Ext.apply(this, {
            title: OpenLayers.i18n('downloadConfirmationWindowTitle'),
            modal: true,
            padding: 15,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 5,
                xtype: 'form',
                items: [
                    this.downloadEmailPanel,
                    {xtype: 'spacer', height: 20},
                    contentPanel
                ],
                buttons: [this.downloadButton, cancelButton],
                keys: [
                    {
                        key: [Ext.EventObject.ESCAPE],
                        handler: this.onCancel,
                        scope: this
                    }
                ]
            },
            listeners: {
                show: this.onShow,
                scope: this
            }
        });

        Portal.cart.DownloadConfirmationWindow.superclass.initComponent.apply(this, arguments);
    },

    hide: function() {
        try {
            Portal.cart.DownloadConfirmationWindow.superclass.hide.call(this);
        }
        catch (e) {
            /**
             * Explicitly ignoring exception
             *
             * https://github.com/aodn/aodn-portal/issues/486
             *
             * Same bugfix as for #175:
             * https://github.com/aodn/aodn-portal/issues/175
             */
        }
    },

    showIfNeeded: function(params) {
        this._showEmailPanelIfNeeded(params);

        this.params = params;
        this.onAcceptCallback = params.onAccept;

        if (!this.hasBeenShown || params.collectEmailAddress) {
            this.show();
        }
        else {
            this.onAccept();
        }
    },

    _showEmailPanelIfNeeded: function(params) {

        if (params.collectEmailAddress) {
            this.downloadEmailPanel.show();
            this.downloadButton.disable();
        }
        else {
            this.downloadEmailPanel.hide();
            this.downloadButton.enable();
        }
    },

    onAccept: function() {
        this.hide();

        if (this.onAcceptCallback) {
            this.params.emailAddress = this.downloadEmailPanel.getEmailValue();
            this.onAcceptCallback(this.params);
        }

        this.hasBeenShown = true;
    },

    onCancel: function() {
        this.hide();
    }
});
