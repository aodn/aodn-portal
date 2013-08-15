/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.Downloader = Ext.extend(Ext.util.Observable, {

    constructor: function(cfg) {
        this.currentlyDownloading = false;
        Ext.apply(this, cfg);

        Portal.cart.Downloader.superclass.constructor.call(this, cfg);

        this.addEvents('downloadstart', 'downloadsuccess', 'downloadfailure');
    },

    start: function() {
        this.currentlyDownloading = true;
        this.fireEvent('downloadstart');

        var success = Portal.utils.FormUtil.createAndSubmit(
            'downloadCart/download',
            {
                items: this.store.getItemsEncodedAsJson()
            }
        );

        // Note: success will currently always be 'true'.
        //
        // We could go to *alot* more trouble to properly handle success/failure,
        // e.g. http://johnculviner.com/jquery-file-download-plugin-for-ajax-like-feature-rich-file-downloads/
        // but I think we should wait and see whether it's actually necessary.
        if (success) {
            this._onDownloadSuccess();
        }
        else {
            this._onDownloadFailure();
        }
    },

    isDownloading: function() {
        return this.currentlyDownloading;
    },

    _onDownloadSuccess: function() {
        this.currentlyDownloading = false;
        this.fireEvent('downloadsuccess');
    },

    _onDownloadFailure: function() {
        this.currentlyDownloading = false;
        this.fireEvent('downloadfailure');
    }
});

Portal.cart.Downloader.isDownloadableLink = function(link) {

    return Portal.cart.Downloader.isDownloadableProtocol(link.protocol);
}

Portal.cart.Downloader.isDownloadableProtocol = function(protocol) {

    var protocols = [];

    Ext.each(Portal.app.config.downloadCartDownloadableProtocols.split("\n"), function(protocol) {
        protocols.push(protocol.trim())
    });

    return (protocols.indexOf(protocol) != -1);
};
