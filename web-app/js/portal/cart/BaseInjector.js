/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.cart');

Portal.cart.BaseInjector = Ext.extend(Object, {
    constructor: function(config) {
        Portal.cart.BaseInjector.superclass.constructor.call(this, Ext4.apply(this, config));
    },

    getInjectionJson: function(collection) {

        return {
            uuid: collection.uuid,
            title: collection.title,
            dataFilters: this._getDataFilterEntry(collection),
            dataMarkup: this._getDataMarkup(collection),
            linkedFiles: this._getMetadataLinks(collection),
            pointOfTruthLink: this._getPointOfTruthLink(collection),
            downloadStatus: collection.downloadStatus
        };
    },

    _getMetadataLinks: function(collection) {
        return collection.linkedFiles;
    },

    _getPointOfTruthLink: function(collection) {
        return collection.pointOfTruthLink;
    },

    _getDataMarkup: function(collection) {
        return this._addDownloadEstimate(collection);
    },

    _getDownloadEstimateHandler: function(collection) {

        var handlerToEstimateWith;

        Ext4.each(collection.dataDownloadHandlers, function(handler) {

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
