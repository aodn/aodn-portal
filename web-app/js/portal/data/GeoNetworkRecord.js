/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Portal.data.LinksField = {
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

Portal.data.BboxField = {
    name: 'bbox',
    convert: function(v, record) {
        var metaDataExtent = new Portal.search.MetadataExtent();
        Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
            metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
        }, this.scope);

        return metaDataExtent;
    }
}

Portal.data.GeoNetworkRecord = Ext.data.Record.create([
    'title',
    'abstract',
    { name: 'uuid', mapping: 'info/uuid' },
    Portal.data.LinksField,
    'source',
    { name: 'canDownload', mapping: '*/canDownload', defaultValue: true },
    Portal.data.BboxField
]);
