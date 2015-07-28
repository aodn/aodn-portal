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

    var constructor = Ext.data.Record.create([
        'uuid',
        'title'
    ]);

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
        return this._getFilteredLinks([
            'OGC:WMS-1.1.1-http-get-map',
            'OGC:WMS-1.3.0-http-get-map'
        ]);
    };

    constructor.prototype.getWfsLayerLinks = function() {
        return this._getFilteredLinks([
            'OGC:WFS-1.0.0-http-get-capabilities'
        ]);
    };

    constructor.prototype.getDataFileLinks = function() {
        return this._getFilteredLinks([
            'WWW:DOWNLOAD-1.0-http--download',
            'WWW:DOWNLOAD-1.0-http--downloaddata',
            'WWW:DOWNLOAD-1.0-http--downloadother',
            'WWW:LINK-1.0-http--downloaddata'
        ]);
    };

    constructor.prototype.getPageLinks = function() {
        return this._getFilteredLinks([
            'WWW:LINK-1.0-http--metadata-URL',
            'WWW:LINK-1.0-http--link',
            'WWW:LINK-1.0-http--downloaddata',
            'WWW:DOWNLOAD-1.0-http--download',
            'WWW:DOWNLOAD-1.0-http--downloaddata',
            'WWW:DOWNLOAD-1.0-http--downloadother' // Todo - DN: Should these lists of protocols be defined somewhere? config? (I don't think they've even been configured any differently)
        ]);
    };

    constructor.prototype._getFilteredLinks = function(protocols) {

        var links = this.getMetadataRecord().get('links');
        var linkStore = new Portal.search.data.LinkStore({
            data: { links: links }
        });

        linkStore.filterByProtocols(protocols);

        return linkStore.getRange(); // Get all records
    };

    return constructor;
}();

Portal.data.DataCollection.fromMetadataRecord = function(metadataRecord) {

    return new Portal.data.DataCollection({
        "title": 'My Data Collection',
        "metadataRecord": metadataRecord
    });
};
