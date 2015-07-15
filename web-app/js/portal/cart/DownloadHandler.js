/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.cart');

Portal.cart.DownloadHandler = Ext.extend(Object, {

    DATE_FORMAT_FOR_PORTAL: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    DEFAULT_LAT_START: -90,
    DEFAULT_LAT_END: 90,
    DEFAULT_LON_START: -180,
    DEFAULT_LON_END: 180,
    DEFAULT_DATE_START: moment.utc({year: 1900}).startOf('year'),
    DEFAULT_DATE_END: moment.utc().endOf('day'),

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        throw 'Should be implemented by subclasses';
    },

    canEstimateDownloadSize: function() {

        return false;
    },

    getDownloadEstimateParams: function() {

        throw "Should be implemented by sublasses which return 'true' for canEstimateDownloadSize()";
    },

    _resourceName: function() {

        return this.onlineResource.name;
    },

    _resourceNameNotEmpty: function() {

        var name = this._resourceName();

        return name && name != "";
    },

    _resourceHref: function() {

        return this.onlineResource.href;
    },

    _resourceHrefNotEmpty: function() {

        var href = this._resourceHref();

        return href && href != "";
    },

    _formatDate: function(date) {

        return date.format(this.DATE_FORMAT_FOR_PORTAL);
    }
});
