/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NoDataInjector = Ext.extend(Object, {

    constructor: function(config) {
        Portal.cart.NoDataInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getInjectionJson: function(collection) {

        console.log(collection);

        var injectionJson = {
            uuid: collection.uuid,
            title: collection.title,
            dataFilters: this._getDataFilterEntry(),
            dataMarkup: this._getDataMarkup(),
            downloadableLinks: this._getMetadataLinks(collection),
            pointOfTruthLink: this._getPointOfTruthLink(collection)
        };

        return injectionJson;
    },

    _getDataFilterEntry: function() {
        return OpenLayers.i18n('noDataMessage');
    },

    _getDataMarkup: function() {
        return '';
    },

    _getMetadataLinks: function(collection) {
        return collection.downloadableLinks;
    },

    _getPointOfTruthLink: function(collection) {
        return collection.pointOfTruthLink;
    }
});
