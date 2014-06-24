/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.AodaacDownloadHandler = Ext.extend(Object, {

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {}
            });

            // TODO - DN: Check with Edward King
          /*  downloadOptions.push({
                textKey: 'downloadAsHdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {}
            });*/

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getClickHandler(),
                handlerParams: {}
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this.onlineResource.name && this.onlineResource.name != "";
    },

    _getClickHandler: function() {

        var productId = this.onlineResource.name;
        var serverUrl = this.onlineResource.href;

        return function(collection) {
            alert('AODAAC, yo!')
        };
    }
});
