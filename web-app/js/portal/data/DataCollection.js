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
        'title',
        'metadataRecord',
        {
            name: 'mapLayers',
            convert: function() {
                console.log('mapLayers.convert()');
                console.log(arguments);
            }
        },
        {
            name: 'dowloadHandlers',
            convert: function() {
                console.log('dowloadHandlers.convert()');
                console.log(arguments);
            }
        },
        {
            name: 'collectionState',
            convert: function() {
                console.log('collectionState.convert()');
                console.log(arguments);
            }
        }
    ]);

    constructor.prototype.asdf = function() {
        console.warn('asdf');
        console.log('arguments');
        console.log(arguments);
        console.log('this');
        console.log(this);
    };

    return constructor;
}();

Portal.data.DataCollection.fromMetadataRecord = function(metadataRecord) {

    console.log('Portal.data.DataCollection.fromMetadataRecord()');

    return new Portal.data.DataCollection({
        "metadataRecord": metadataRecord,
        "mapLayers": [metadataRecord.getFirstWmsLink()],
        "somethingElse": {}
    });
};
