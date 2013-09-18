/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data.GeoNetworkRecord');

Portal.data.GeoNetworkRecord.create = function() {

    var convertXmlToLinks = function(v, record) {
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

    isDownloadableProtocol = function(protocol) {

        var protocols = [];

        Ext.each(Portal.app.config.downloadCartDownloadableProtocols.split("\n"), function(protocol) {
            protocols.push(protocol.trim())
        });

        return (protocols.indexOf(protocol) >= 0);
    };

    var LinksField = {
        name: 'links',
        convert: convertXmlToLinks
    };

    var DownloadableLinksField = {
        name: 'downloadableLinks',
        convert: function(v, record) {

            var allLinks = convertXmlToLinks(v, record);
            var downloadableLinks = [];

            Ext.each(allLinks, function(linkToCheck) {
                if (isDownloadableProtocol(linkToCheck.protocol)) {
                    downloadableLinks.push(linkToCheck);
                }
            });

            return downloadableLinks;
        }
    };

    var BboxField = {
        name: 'bbox',
        convert: function(v, record) {
            var metaDataExtent = new Portal.search.MetadataExtent();
            Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
                metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
            }, this.scope);

            return metaDataExtent;
        }
    };

    var PointOfTruthLinkField = {
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

    var f = Ext.data.Record.create([
        'title',
        'abstract',
        { name: 'uuid', mapping: '*/uuid' },
        LinksField,
        DownloadableLinksField,
        PointOfTruthLinkField,
        'source',
        { name: 'canDownload', mapping: '*/canDownload', defaultValue: true },
        BboxField,
        'wmsLayer'
    ]);

    var p = f.prototype;

    p.getFirstWmsLink = function() {
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

    p.hasWmsLink = function() {
        return this.getFirstWmsLink() != undefined;
    };

    p.convertedData = function() {
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

    p.wfsDownloadInfoForLayer = function(layer) {
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

    return f;
};

Portal.data.GeoNetworkRecord = Portal.data.GeoNetworkRecord.create();
