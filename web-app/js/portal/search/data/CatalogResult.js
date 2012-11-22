
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.data');

Portal.search.data.CatalogResult = Ext.extend(Object, {

    constructor:function(config){
        Portal.search.data.CatalogResult.superclass.constructor.call(this, config);

        var cfg = config || {};
        Ext.apply(this, cfg);

        this._bind(this.record);
    },

    getDownloadLinks: function(downloadProtocols) {
        var downloads = new Array();

        Ext.each(this.links, function(link) {
            if (this._isDownloadable(downloadProtocols, link)) {
                downloads.push( {record: this.record, link: link} );
            }
        }, this);

        return downloads;
    },

    _isDownloadable: function(downloadProtocols, link) {
        if (downloadProtocols.indexOf(link.protocol) == -1)
            return false;

        if (this._isGeonetworkDownload(link.protocol)) {
            // must have permission to download GeoNetwork links
            return this.canDownload;
        } else {
            return true;
        }
    },

    _isGeonetworkDownload: function(protocol) {
        return protocol.indexOf('WWW:DOWNLOAD-') == 0 && protocol.indexOf('http--download') > 0;
    },

    _bind: function(record) {
        if (!record) return;

        record.fields.each(function(field) {
            this[field.name] = record.get(field.name);
        }, this);
    }
});
