Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    NAME_FIELD_DELIMETER: "#",
    LAYER_NAME_INDEX: 0,
    FIELD_NAME_INDEX: 1,

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            var generatorFunction = this._getUrlGeneratorFunction();
            var urlFieldName =  this._urlFieldName();

            downloadOptions.push({
                textKey: 'downloadAsAllSourceNetCdfLabel',
                type: 'WFS',
                handler: this.downloadClickHandler,
                handlerParams: {
                    generatorFunction: generatorFunction,
                    collectionFiltersAsTextFunction: this.getCollectionFiltersAsText,
                    filenameFormat: '{0}_source_files.zip',
                    downloadControllerArgs: {
                        action: 'downloadNetCdfFilesForLayer',
                        urlFieldName: urlFieldName
                    }
                }
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this.downloadClickHandler,
                handlerParams: {
                    generatorFunction: generatorFunction,
                    collectionFiltersAsTextFunction: this.getCollectionFiltersAsText,
                    filenameFormat: '{0}_URLs.txt',
                    downloadControllerArgs: {
                        action: 'urlListForLayer',
                        urlFieldName: urlFieldName
                    }
                }
            });
        }

        return downloadOptions;
    },

    canEstimateDownloadSize: function() {

        return true;
    },

    getDownloadEstimateParams: function(collection) {

        var urlFn = this._getUrlGeneratorFunction();

        return {
            url: urlFn(collection),
            urlFieldName: this._urlFieldName()
        };
    },

    _hasRequiredInfo: function() {

        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty() && (this._resourceName().indexOf(this.NAME_FIELD_DELIMETER) > -1);
    },

    downloadClickHandler: function(collection,args) {

        trackDownloadUsage(
            args.downloadControllerArgs.action,
            collection.getTitle(),
            args.collectionFiltersAsTextFunction(collection)
        );

        return args.generatorFunction(collection);
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection) {

            var builder = new Portal.filter.combiner.BodaacCqlBuilder({
                filters: collection.getFilters()
            });

            return OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
                _this._resourceHref(),
                _this._layerName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV,
                builder.buildCql()
            );
        };
    },

    _layerName: function() {
        return this._valueFromNameField(this.LAYER_NAME_INDEX);
    },

    _urlFieldName: function() {
        return this._valueFromNameField(this.FIELD_NAME_INDEX);
    },

    _valueFromNameField: function(index) {
        return this.onlineResource.name.split(this.NAME_FIELD_DELIMETER)[index];
    }
});
