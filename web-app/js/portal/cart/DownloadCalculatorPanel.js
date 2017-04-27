Ext.namespace('Portal.cart');

Portal.cart.DownloadCalculatorPanel = Ext.extend(Ext.Panel, {


    initComponent: function() {

        Ext.apply(this, {
            html: this.getFormattedContent(OpenLayers.i18n('downloadCalculatorLoadingContent')),
            cls: "alert alert-warning"
        });

        Portal.cart.DownloadCalculatorPanel.superclass.initComponent.apply(this, arguments);
    },

    getContent: function(downloadUrl) {
        log.debug('downloading estimator asynchronously', downloadUrl);

        Ext.Ajax.request({
            url: downloadUrl,
            scope: this,
            success: function(response) {
                this._onSuccess(response);
            },
            failure: function(response) {
                this._onFailure(response);
            }
        });
    },

    _onSuccess: function(response) {
        this.update(this.getFormattedContent(response.responseText));
    },

    _onFailure: function(response) {
        var msg = String.format("Unable to estimate file size: '{0}'", response.statusText);
        this.update(msg);
    },

    getFormattedContent: function(msg) {
        return String.format("<h3>{0}</h3>",msg);
    }
});
