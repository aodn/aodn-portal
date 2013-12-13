
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NoDataRowTemplate = Ext.extend(Object, {

    constructor: function(config) {
        Portal.cart.NoDataRowTemplate.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getDataFilterEntry: function(values) {
        return String.format('<i>{0}</i>', OpenLayers.i18n('noFilterMessage'));
    },

    createMenuItems: function (collection) {
        return [];
    },

    getDataSpecificMarkup: function () {
        return '';
    },

    attachMenuEvents: function(collection) {},

    downloadWithConfirmation: function(downloadUrl, downloadFilename, downloadControllerArgs) {
        return function () {
            this.downloadConfirmation.call(this.downloadConfirmationScope, downloadUrl, downloadFilename, downloadControllerArgs);
        };
    }
});
