/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data.DataCollection');

Portal.data.DataCollection = function() {
    /*
    COnstructor takign GNR?
    UUID
    Title
    Metadata -> GNR
    Map Layers -> (To what?)
    Downloads -> (To what? DownloadHandlers?) -- Maybe doenload handlers should all live in step 3 and this is just a list of oibjects which represent downlaods
    State? (for now?)
    */

    var constructor = Ext.data.Record.create([]);

    constructor.prototype.getTitle = function() {
        return this.getMetadataRecord().get('title');
    };

    constructor.prototype.getUuid = function() {
        return this.getMetadataRecord().get('uuid');
    };

    constructor.prototype.getMetadataRecord = function() {
        return this.data.metadataRecord;
    };

    constructor.prototype.getDefaultWmsLayerLink = function() {

        var layers = this.getWmsLayerLinks();

        if (layers.length == 0) {
            return null;
        }

        var tmp = new Portal.search.data.LinkStore(); // Todo - DN: Do this better (extract where?)
        return tmp._convertLink(layers[0]);
    };

    constructor.prototype.getWmsLayerLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.wms);
    };

    constructor.prototype.getWfsLayerLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.wfs);
    };

    constructor.prototype.getDataFileLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.dataFile);
    };

    constructor.prototype.getWebPageLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.webPage);
    };

    constructor.prototype.getDataDownloadHandlers = function() {

        var protocolHandlerConstructors = { // Todo - DN: Should this mapping live in config?
            'OGC:WFS-1.0.0-http-get-capabilities': [
                Portal.cart.WfsDownloadHandler,
                Portal.cart.PythonDownloadHandler
            ],
            'IMOS:AGGREGATION--bodaac': Portal.cart.BodaacDownloadHandler,
            'IMOS:AGGREGATION--gogoduck': Portal.cart.GogoduckDownloadHandler
        };

        var applicableDownloadOptions = [];

        Ext.each(this._getRawLinks(), function(link) {
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
    };

    constructor.prototype._getRawLinks = function() { // Todo - DN: 'raw' here because they haven't gone thorugh the LayerStore. What is a better name?
        return this.getMetadataRecord().get('links');
    };

    constructor.prototype._getFilteredLinks = function(protocols) {

        var linkStore = new Portal.search.data.LinkStore({
            data: { links: this._getRawLinks() }
        });

        linkStore.filterByProtocols(protocols);

        return linkStore.getRange(); // Get all records
    };

    return constructor;
}();

Portal.data.DataCollection.fromMetadataRecord = function(metadataRecord) {
    return new Portal.data.DataCollection({
        "metadataRecord": metadataRecord
    });
};
