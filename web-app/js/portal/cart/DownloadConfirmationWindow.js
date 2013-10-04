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
        var downloadButton = {
            text:OpenLayers.i18n('downloadConfirmationDownloadText'),
            listeners: {
                scope: this,
                click: this.onAccept
            }
        };
        var cancelButton = {
            text:OpenLayers.i18n('downloadConfirmationCancelText'),
            listeners: {
                scope: this,
                click: this.onCancel
            }
        };

        Ext.apply(this, {
            title:OpenLayers.i18n('downloadConfirmationWindowTitle'),
            modal: true,
            padding: 15,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 5,
                xtype: 'form',
                items: [contentPanel],
                buttons: [downloadButton, cancelButton],
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
        } catch (e) {
            /**
             * Explicitly ignoring exception
             *
             * https://github.com/aodn/aodn-portal/issues/486
             *
             * @tofojo's own words:
             * This appears to have existed forever in IE, it basically comes down to Shadow.realign in Ext where the
             * height value is determined as -1 which is invalid. At no point do we set the height to -1 so I assume that
             * IE does this when the FeatureInfoPopup is hidden from view or something else crazy. I _hope_ that the popup
             * is still destroyed effectively, it all seems to still work. I'm happy for someone else to find a better
             * solution, I take no pride in this fix whatsoever.
             *
             * My interpretation (DF):
             * IE8 IS SHIT KTHX BYE
             */
        }
    },

    showIfNeeded: function(downloadUrl) {

        this.downloadUrl = downloadUrl;

        if (!this.hasBeenShown) {

            this.show();
        }
        else {

            this.onAccept();
        }
    },

    onAccept: function() {

        this.hide();

        if (this.downloadUrl) {

            this.hasBeenShown = true;
            this._openDownload(this.downloadUrl);
        }
    },

    onCancel: function() {

        this.hide();
    },

    _openDownload: function(url) {

        window.open(url, '_blank');
    }
});
