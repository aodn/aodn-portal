
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.GeoNetworkRecordStore = Ext.extend(Ext.data.XmlStore, {

    constructor : function(cfg) {

        cfg = cfg || {};

        var defaults = {
        };

        var config = Ext.apply({
            record : 'metadata',
            totalProperty: 'summary/@count',
            fields: Portal.data.GeoNetworkRecord
        }, cfg, defaults);

        Portal.data.GeoNetworkRecordStore.superclass.constructor.call(this, config);
    },

    _getLinks: function(v, record){
        var linkElems = Ext.DomQuery.jsSelect('link', record);
        var links = new Array();

        Ext.each(linkElems, function(link) {
            var linkValue = link.firstChild ? link.firstChild.nodeValue : null;
            var elements = linkValue.split('|');

            links.push({
                href: elements[2],
                name: elements[0],
                protocol: elements[3],
                title: elements[1],
                type: elements[4]
            });
        }, this);

        return links;
    },

    _getMetadataExtent: function(v, record) {
        var metaDataExtent = new Portal.search.MetadataExtent();
        Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
            metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
        }, this.scope);

        return metaDataExtent;
    }
});
