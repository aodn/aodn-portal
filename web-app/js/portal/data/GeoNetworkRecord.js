/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data.GeoNetworkRecord');

Portal.data.GeoNetworkRecord = function() {

    var PROTOCOL_WWW_METADATA_LINK = 'WWW:LINK-1.0-http--metadata-URL';

    var linksField = {
        name: 'links',
        convert: convertXmlToLinks
    };

    var linkedFilesField = {
        name: 'linkedFiles',
        convert: function(v, record) {

            var allLinks = convertXmlToLinks(v, record);
            var linkedFiles = [];

            Ext.each(allLinks, function(linkToCheck) {
                if (isLinkedFileProtocol(linkToCheck.protocol)) {
                    linkedFiles.push(linkToCheck);
                }
            });

            return linkedFiles;
        }
    };

    var bboxField = {
        name: 'bbox',
        convert: function(v, record) {
            var metaDataExtent = new Portal.search.MetadataExtent();

            Ext.each(Ext.DomQuery.jsSelect('geoBox', record), function(geoBox) {
                metaDataExtent.addBBox(geoBox.firstChild.nodeValue);
            }, this.scope);

            Ext.each(Ext.DomQuery.jsSelect('geoPolygon', record), function(geoPolygon) {
                metaDataExtent.addPolygon(geoPolygon.firstChild.nodeValue);
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
                if (linkToCheck.protocol == PROTOCOL_WWW_METADATA_LINK) {

                    pointOfTruthLink = linkToCheck;
                }
            });

            return pointOfTruthLink;
        }
    };

    var dataDownloadHandlersField = {
        name: 'dataDownloadHandlers',
        convert: function(v, record) {
            var allLinks = convertXmlToLinks(v, record);

            var protocolHandlerConstructors = {
                'OGC:WFS-1.0.0-http-get-capabilities': [
                    Portal.cart.WfsDownloadHandler,
                    Portal.cart.PythonDownloadHandler
                ],
                'IMOS:AGGREGATION--bodaac': Portal.cart.BodaacDownloadHandler,
                'IMOS:AGGREGATION--gogoduck': Portal.cart.GogoduckDownloadHandler
            };

            var applicableDownloadOptions = [];

            Ext.each(allLinks, function(link) {
                var constructors = protocolHandlerConstructors[link.protocol];

                if (constructors) {
                    Ext.each(constructors, function(constructor) {
                        applicableDownloadOptions.push(
                            new constructor(link)
                        );
                    })
                }
            }, this);

            return applicableDownloadOptions;
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

    function isLinkedFileProtocol(protocol) {

        var protocols = [];

        Ext.each(Portal.app.appConfig.portal.downloadCartDownloadableProtocols, function(protocol) {
            protocols.push(protocol.trim());
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
        linkedFilesField,
        pointOfTruthLinkField,
        dataDownloadHandlersField,
        'source',
        bboxField,
        'wmsLayer',
        'ncwmsParams'
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

        linkStore.filterByProtocols(Portal.app.appConfig.portal.metadataLayerProtocols);

        return linkStore.getLayerLink(0);
    };

    prototype.hasWmsLink = function() {
        return this.getFirstWmsLink() != undefined;
    };

    prototype.convertedData = function() {
        var convertedData = {};

        Ext.each(Object.keys(this.data),
            function(key) {
                convertedData[key] = this.data[key];
            },
            this
        );

        return convertedData;
    };

    prototype.updateNcwmsParams = function(dateRangeStart, dateRangeEnd, geometry) {

        var params = {};

        if (dateRangeStart && dateRangeStart.isValid()) {
            params.dateRangeStart = dateRangeStart;
        }

        if (dateRangeEnd && dateRangeEnd.isValid()) {
            params.dateRangeEnd = dateRangeEnd;
        }

        if (geometry) {
            var bounds = geometry.getBounds();

            params.latitudeRangeStart = bounds.bottom;
            params.longitudeRangeStart = bounds.left;
            params.latitudeRangeEnd = bounds.top;
            params.longitudeRangeEnd = bounds.right;
        }

        this.set('ncwmsParams', params);
    };

    return constructor;
}();
