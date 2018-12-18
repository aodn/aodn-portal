
Ext.namespace('Portal.data.MetadataRecord');

Portal.data.MetadataRecord = function() {

    var PROTOCOL_WWW_METADATA_LINK = 'WWW:LINK-1.0-http--metadata-URL';

    var iconSourceUuid = {
        name: 'iconSourceUuid',
        mapping: 'source'
    };

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

    var onlineResourcesField = {
        name: 'onlineResources',
        convert: function(v, record) {

            var allLinks = convertXmlToLinks(v, record);
            var onlineResources = [];

            Ext.each(allLinks, function(linkToCheck) {
                if (isOnlineResource(linkToCheck.protocol)) {
                    onlineResources.push(linkToCheck);
                }
            });

            return onlineResources;
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

    var parameterField = new Portal.data.ChildElementsField({
        name: 'parameter'
    });

    var organisationField = new Portal.data.ChildElementsField({
        name: 'organisation'
    });

    var platformField = new Portal.data.ChildElementsField({
        name: 'platform'
    });

    var attrConstrField = new Portal.data.ChildElementsField({
        name: 'attrConstr'
    });

    var otherConstrField = new Portal.data.ChildElementsField({
        name: 'otherConstr'
    });

    var useLimitationField = new Portal.data.ChildElementsField({
        name: 'useLimitation'
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

        Ext.each(Portal.app.appConfig.portal.metadataProtocols.dataFile, function(protocol) {
            protocols.push(protocol.trim());
        });

        return (protocols.indexOf(protocol) >= 0);
    }

    function isOnlineResource(protocol) {

        var allowedOnlineResources = [];

        var onlineResourceProtocols = Portal.app.appConfig.portal.metadataProtocols.supplementary.concat(
            Portal.app.appConfig.portal.metadataProtocols.metadataRecord
        );

        Ext.each(onlineResourceProtocols, function(protocol) {
            allowedOnlineResources.push(protocol.trim());
        });

        return (allowedOnlineResources.indexOf(protocol) >= 0);
    }

    var constructor = Ext.data.Record.create([
        'title',
        'abstract',
        { name: 'uuid', mapping: '*/uuid' },
        parameterField,
        platformField,
        organisationField,
        'jurisdictionLink',
        'licenseLink',
        'licenseName',
        'imageLink',
        attrConstrField,
        otherConstrField,
        useLimitationField,
        { name: 'temporalExtentBegin', mapping: 'tempExtentBegin' },
        { name: 'temporalExtentEnd', mapping: 'tempExtentEnd' },
        linksField,
        linkedFilesField,
        onlineResourcesField,
        pointOfTruthLinkField,
        bboxField,
        iconSourceUuid
    ]);

    constructor.prototype.getBounds = function() {
        return this.data.bbox.bounds;
    };

    return constructor;
}();
