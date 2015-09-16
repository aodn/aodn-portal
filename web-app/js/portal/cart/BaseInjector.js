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

    _getMetadataLinks: function(dataCollection) {
        return dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.dataFile);
    },

    _getPointOfTruthLink: function(dataCollection) {
        return dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.metadataRecord);
    },

    _getDataMarkup: function(dataCollection) {
        return this._addDownloadEstimate(dataCollection);
    },

    _getDownloadEstimateHandler: function(dataCollection) {

        var handlerToEstimateWith;

        var downloadHandlers = Portal.cart.DownloadHandler.handlersForDataCollection(dataCollection);
        Ext.each(downloadHandlers, function(handler) {

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

    _addDownloadEstimate: function(dataCollection) {

        var estimateHandler = this._getDownloadEstimateHandler(dataCollection);

        if (estimateHandler) {
            var estimator = new Portal.cart.DownloadEstimator({
                estimateRequestParams: estimateHandler.getDownloadEstimateParams(dataCollection)
            });

            if (this._shouldEstimateSize()) {
                estimator._getDownloadEstimate(
                    dataCollection,
                    this._hideButton
                );
            }

            return String.format(
                "<div id=\"{0}\">{1}{2}</div>",
                estimator.getIdElementName(dataCollection.getUuid()),
                OpenLayers.i18n("estimatedDlLoadingMessage"),
                OpenLayers.i18n("faSpinner")
            );
        }
        else {
            return String.format('<div>{0}</div>', OpenLayers.i18n('estimatedDlFailedMsg'));
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
