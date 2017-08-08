Ext.namespace('Portal.cart');

Portal.cart.DownloadCalculatorPanel = Ext.extend(Ext.Panel, {


    initComponent: function() {

        Ext.apply(this, {
            html: this.getFormattedContent(OpenLayers.i18n('downloadCalculatorLoadingContent')),
            cls: "alert alert-warning"
        });

        Portal.cart.DownloadCalculatorPanel.superclass.initComponent.apply(this, arguments);
    },

    hasDownloadEstimatorService: function(collection) {
        var downloadHandlers = collection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.dataDownloadEstimator);

        if (downloadHandlers[0]) {
            return downloadHandlers[0].url;
        }
    },


    setContent: function(downloadCalculatorUrl) {

        Ext.Ajax.request({
            url: downloadCalculatorUrl,
            scope: this,
            success: function(response) {
                this._onSuccess(response);
            },
            failure: function() {
                this._onFailure();
            }
        });
    },

    _onSuccess: function(response) {

        var res = Ext.util.JSON.decode(response.responseText);

        var sizeDescription = humanFileSize(res.estimate);
        if (sizeDescription) {
            var msg = String.format(OpenLayers.i18n('downloadCalculationMessage'), sizeDescription);
            this.update(this.getFormattedContent(msg));
        }
        else {
            this._onFailure();
        }
    },

    _onFailure: function() {
        this.update(this.getFormattedContent("Unable to estimate download size"));
    },

    getFormattedContent: function(msg) {
        return String.format("<h3>{0}</h3>",msg);
    }
});