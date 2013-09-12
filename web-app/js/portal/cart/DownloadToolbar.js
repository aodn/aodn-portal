/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadToolbar = Ext.extend(Ext.Toolbar, {

    constructor: function() {

        this.clearCartButton = new Ext.Button({
            text: OpenLayers.i18n('clearcart'),
            listeners: {
                'click': function(button, event) {
                    Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll();
                }
            }
        });

        this.downloadAllButton = new Ext.Button({
            text: OpenLayers.i18n('okdownload'),
            listeners: {
                scope: this,
                'click': function(button, event) {
                    new Portal.cart.DownloadConfirmationWindow().show();
                    this._updateButtonStates();
                }
            }
        });

        var config = {
            items: [
                this.downloadAllButton,
                this.clearCartButton
            ],
            store: Portal.data.ActiveGeoNetworkRecordStore.instance()
        };

        Portal.cart.DownloadToolbar.superclass.constructor.call(this, config);

        this._updateButtonStates();

        this._registerStoreEventHandlers();
    },

    _registerStoreEventHandlers: function() {
        Ext.each(['add', 'remove', 'clear', 'downloadstart', 'downloadsuccess', 'downloadfailure'], function(eventName) {
            this.store.on(eventName, this._updateButtonStates, this);
        }, this);
    },

    _updateButtonStates: function() {
        if (   Portal.data.ActiveGeoNetworkRecordStore.instance().isDownloading()
            || this.store.getCount() == 0) {
            this._disableButtons();
        }
        else {
            this._enableButtons();
        }
    },

    _disableButtons: function() {
        this.clearCartButton.disable();
        this.downloadAllButton.disable();
    },

    _enableButtons: function() {
        this.clearCartButton.enable();
        this.downloadAllButton.enable();
    }
});
