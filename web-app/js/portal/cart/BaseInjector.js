Ext.namespace('Portal.cart');

Portal.cart.BaseInjector = Ext.extend(Object, {
    constructor: function(config) {
        Portal.cart.BaseInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getInjectionJson: function(dataCollection) {

        return {
            uuid: dataCollection.getUuid(),
            title: dataCollection.getTitle(),
            dataFilters: this._getDataFilterEntry(dataCollection),
            linkedFiles: this._getMetadataLinks(dataCollection),
            pointOfTruthLink: this._getPointOfTruthLink(dataCollection),
            downloadStatus: dataCollection.downloadStatus
        };
    },

    _getMetadataLinks: function(dataCollection) {
        return dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.dataFile);
    },

    _getDataFilterEntry: function(dataCollection) {
        return "";
    },

    _getPointOfTruthLink: function(dataCollection) {
        return dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.metadataRecord);
    },

    _hideButton: function(uuid) {

        var elementId = OpenLayers.i18n('downloadButtonId', {id: uuid});
        if (Ext.get(elementId)) {
            Ext.fly(elementId).update("");
        }
    },

    downloadWithConfirmation: function(dataCollection, generateUrlCallback, params) {

        return function() {
            this.downloadConfirmation.call(
                this.downloadConfirmationScope,
                dataCollection,
                this,
                generateUrlCallback,
                params
            );
        };
    }
});
