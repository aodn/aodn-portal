/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Ext.namespace('Portal.data.GeoNetworkRecord');

// TODO: tried to namespace this, but unsuccessfully.
convertXmlToLinks = function(v, record) {
    var linkElems = Ext.DomQuery.jsSelect('link', record);
    var links = [];

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
};

Portal.data.GeoNetworkRecord.LinksField = {
    name: 'links',
    convert: convertXmlToLinks
};

Portal.data.GeoNetworkRecord.DownloadableLinksField = {
    name: 'downloadableLinks',
    convert: function(v, record) {

        var allLinks = convertXmlToLinks(v, record);
        var downloadableLinks = [];

        Ext.each(allLinks, function(linkToCheck) {
            if (Portal.cart.Downloader.isDownloadableProtocol(linkToCheck.protocol)) {
                downloadableLinks.push(linkToCheck);
            }
        });

        return downloadableLinks;
    }
};

Portal.data.GeoNetworkRecord.PointOfTruthLinkField = {
    name: 'pointOfTruthLink',
    convert: function(v, record) {

        var allLinks = convertXmlToLinks(v, record);
        var pointOfTruthLink = undefined;

        Ext.each(allLinks, function(linkToCheck) {
            if (linkToCheck.protocol == 'WWW:LINK-1.0-http--metadata-URL') {

                pointOfTruthLink = linkToCheck;
            }
        });

        return pointOfTruthLink;
    }
};

Portal.data.GeoNetworkRecord.BboxField = {
    name: 'bbox',
    convert: function(v, record) {
        var metaDataExtent = new Portal.search.MetadataExtent();
        Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
            metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
        }, this.scope);

        return metaDataExtent;
    }
};

Portal.data.GeoNetworkRecord.create = function(o){

    var f = Ext.data.Record.create(o);

    Portal.data.GeoNetworkRecord._addGetPointOfTruthUrl(f.prototype);
    Portal.data.GeoNetworkRecord._addGetFirstWmsLink(f.prototype);
    Portal.data.GeoNetworkRecord._addHasWmsLink(f.prototype);
    Portal.data.GeoNetworkRecord._addConvertData(f.prototype);
    Portal.data.GeoNetworkRecord._addWfsDownloadInfoForLayer(f.prototype);

    return f;
};

Portal.data.GeoNetworkRecord._addGetPointOfTruthUrl = function(prototype) {

    prototype.getPointOfTruthUrl = function() {
        var links = this.get('links');

        if (!links) {
            return undefined;
        }

        var linkStore = new Portal.search.data.LinkStore({
            data: {
                links: links
            }
        });

        linkStore.filterByProtocols();

        return linkStore.getLayerLink(0);
    };
};

Portal.data.GeoNetworkRecord._addGetFirstWmsLink = function(prototype) {

    prototype.getFirstWmsLink = function() {
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
    };
};

Portal.data.GeoNetworkRecord._addHasWmsLink = function(prototype) {

    prototype.hasWmsLink = function() {

        return this.getFirstWmsLink() != undefined;
    };
};

Portal.data.GeoNetworkRecord._addConvertData = function(prototype) {

    prototype.convertedData = function() {

        var convertedData = {};

        Ext.each(
            Object.keys(this.data),
            function(key) {

                var item = this.data[key];

                if (key == 'wmsLayer') {

                    convertedData['wfsDownloadInfo'] = this.wfsDownloadInfoForLayer(item);
                }
                else {

                    convertedData[key] = item;
                }
            },
            this
        );

        return convertedData;
    };
};

Portal.data.GeoNetworkRecord._addWfsDownloadInfoForLayer = function(prototype) {

    prototype.wfsDownloadInfoForLayer = function(layer) {

        var wfsLayer = layer.wfsLayer;

        var layerName;
        var serverUri;

        if (wfsLayer) {

            layerName = wfsLayer.name;
            serverUri = wfsLayer.server.uri;
        }
        else {

            layerName = layer.params.LAYERS;
            serverUri = layer.server.uri;
        }

        return {
            layerName: layerName,
            serverUri: serverUri,
            cqlFilter: layer.params.CQL_FILTER ? layer.params.CQL_FILTER : "",
            metadataUrl: layer.getMetadataUrl()
        };
    };
};

Portal.data.GeoNetworkRecord = Portal.data.GeoNetworkRecord.create([
    'title',
    'abstract',
    { name: 'uuid', mapping: '*/uuid' },
    Portal.data.GeoNetworkRecord.LinksField,
    Portal.data.GeoNetworkRecord.DownloadableLinksField,
    Portal.data.GeoNetworkRecord.PointOfTruthLinkField,
    'source',
    { name: 'canDownload', mapping: '*/canDownload', defaultValue: true },
    Portal.data.GeoNetworkRecord.BboxField,
    'wmsLayer'
]);
