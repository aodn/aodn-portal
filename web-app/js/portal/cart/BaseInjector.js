/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
            dataMarkup: this._getDataMarkup(dataCollection),
            linkedFiles: this._getMetadataLinks(dataCollection),
            pointOfTruthLink: this._getPointOfTruthLink(dataCollection),
            downloadStatus: dataCollection.downloadStatus
        };
    },

    _getMetadataLinks: function(collection) {
        return collection.getDataFileLinks();
    },

    _getPointOfTruthLink: function(collection) {
        return collection.getMetadataRecord().data.pointOfTruthLink;
    },

    _getDataMarkup: function(collection) {
        return this._addDownloadEstimate(collection);
    },

    _getDownloadEstimateHandler: function(collection) {

        var handlerToEstimateWith;

        Ext.each(collection.getDataDownloadHandlers(), function(handler) {

            if (handler.canEstimateDownloadSize()) {
                handlerToEstimateWith = handler;
            }
        });

        return handlerToEstimateWith;
    },

    _hideButton: function(uuid) {

        var elementId = OpenLayers.i18n('downloadButtonId', {id: uuid});
        if (Ext.get(elementId)) {
            Ext.fly(elementId).update("");
        }
    },

    _shouldEstimateSize: function() {
        return viewport.isOnTab(TAB_INDEX_DOWNLOAD);
    },

    _addDownloadEstimate: function(collection) {

        var estimateHandler = this._getDownloadEstimateHandler(collection);

        if (estimateHandler) {
            var estimator = new Portal.cart.DownloadEstimator({
                estimateRequestParams: estimateHandler.getDownloadEstimateParams(collection)
            });

            if (this._shouldEstimateSize()) {
                estimator._getDownloadEstimate(
                    collection,
                    this._hideButton
                );
            }

            return String.format(
                "<div id=\"{0}\">{1}{2}</div>",
                estimator.getIdElementName(collection.uuid),
                OpenLayers.i18n("estimatedDlLoadingMessage"),
                OpenLayers.i18n("faSpinner")
            );
        }
        else {
            return String.format('<div>{0}</div>', OpenLayers.i18n('estimatedDlFailedMsg'));
        }
    },

    downloadWithConfirmation: function(collection, generateUrlCallback, params) {

        return function() {
            this.downloadConfirmation.call(
                this.downloadConfirmationScope,
                collection,
                this,
                generateUrlCallback,
                params
            );
        };
    }
});
