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
        return this.getFilteredLinks(['OGC:WMS-1.1.1-http-get-map']);
    };

    constructor.prototype.getFilteredLinks = function(protocols) {

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

    console.log('Portal.data.DataCollection.fromMetadataRecord()');

    return new Portal.data.DataCollection({
        "title": 'My Data Collection',
        "metadataRecord": metadataRecord
    });
};
