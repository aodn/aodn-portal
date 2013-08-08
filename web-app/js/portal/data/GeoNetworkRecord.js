/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Ext.namespace('Portal.data.GeoNetworkRecord');

Portal.data.GeoNetworkRecord.LinksField = {
    name: 'links',
    convert: function(v, record) {
        var linkElems = Ext.DomQuery.jsSelect('link', record);
        var links = new Array();

        Ext.each(linkElems, function(link) {
            var linkValue = link.firstChild ? link.firstChild.nodeValue : null;
            var elements = linkValue.split('|');

            links.push({
                name: elements[0],
                title: elements[1],
                href: elements[2],
                protocol: elements[3],
                type: elements[4]
            });
        }, this);

        return links;
    }
}

Portal.data.GeoNetworkRecord.BboxField = {
    name: 'bbox',
    convert: function(v, record) {
        var metaDataExtent = new Portal.search.MetadataExtent();
        Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
            metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
        }, this.scope);

        return metaDataExtent;
    }
}

Portal.data.GeoNetworkRecord.create = function(o){

    var f = Ext.data.Record.create(o);

    f.prototype.getFirstWmsLink = function() {
        var links = this.get('links');

        if (!links) {
            return undefined;
        }

        var linkStore = new Portal.search.data.LinkStore({
            data: {
                links: links
            }
        });

        linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);

        return linkStore.getLayerLink(0);
    }

    f.prototype.hasWmsLink = function() {
        return this.getFirstWmsLink() != undefined;
    }

    return f;
};

Portal.data.GeoNetworkRecord = Portal.data.GeoNetworkRecord.create([
    'title',
    'abstract',
    { name: 'uuid', mapping: '*/uuid' },
    Portal.data.GeoNetworkRecord.LinksField,
    'source',
    { name: 'canDownload', mapping: '*/canDownload', defaultValue: true },
    Portal.data.GeoNetworkRecord.BboxField
]);
