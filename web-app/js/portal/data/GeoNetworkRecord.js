/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data.GeoNetworkRecord');

Portal.data.GeoNetworkRecord = function() {

    var linksField = {
        name: 'links',
        convert: convertXmlToLinks
    };

    var downloadableLinksField = {
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

    var bboxField = {
        name: 'bbox',
        convert: function(v, record) {
            var metaDataExtent = new Portal.search.MetadataExtent();
            Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
                metaDataExtent.addPolygon(geoBox.firstChild.nodeValue);
            }, this.scope);

            return metaDataExtent;
        }
    };

    var popularity = {
        name: 'popularity',
        convert: function(v, record) {
            var popularity = Ext.DomQuery.jsSelect('popularity', record);
            return parseInt(popularity[0].childNodes[0].nodeValue);
        }
    };

    var pointOfTruthLinkField = {
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

    var parameterField = new Portal.data.ChildElementsField({
        name: 'parameter'
    });

    var organisationField = new Portal.data.ChildElementsField({
        name: 'organisation'
    });

    function convertXmlToLinks(v, record) {
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
    }

    function isDownloadableProtocol(protocol) {

        var protocols = [];

        Ext.each(Portal.app.config.downloadCartDownloadableProtocols.split("\n"), function(protocol) {
            protocols.push(protocol.trim())
        });

        return (protocols.indexOf(protocol) >= 0);
    }

    var constructor = Ext.data.Record.create([
        'title',
        'abstract',
        popularity,
        { name: 'uuid', mapping: '*/uuid' },
        parameterField,
        'platform',
        organisationField,
        { name: 'temporalExtentBegin', mapping: 'tempExtentBegin' },
        { name: 'temporalExtentEnd', mapping: 'tempExtentEnd' },
        linksField,
        downloadableLinksField,
        pointOfTruthLinkField,
        'source',
        { name: 'canDownload', mapping: '*/canDownload', defaultValue: true },
        bboxField,
        'wmsLayer',
        'gogoduckParams'
    ]);

    var prototype = constructor.prototype;

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

    prototype.hasWmsLink = function() {
        return this.getFirstWmsLink() != undefined;
    };

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

    prototype.updateGogoduckParams = function(params) {

        this.set('gogoduckParams', params);
    };

    return constructor;
}();
