Ext.namespace('Portal.cart');

Portal.cart.InsertionService = Ext.extend(Object, {

    constructor: function(downloadPanel) {

        this.downloadPanel = downloadPanel;
    },

    insertionValues: function(collection) {

        var htmlInjection;

        if (this._isCollectionDownloadable(collection)) {
            if (collection.isNcwms()) {
                htmlInjection = new Portal.cart.NcWmsInjector();
            }
            else {
                htmlInjection = new Portal.cart.WmsInjector();
            }
        }
        else {
            htmlInjection = new Portal.cart.NoDataInjector();
        }

        return htmlInjection.getInjectionJson(collection);
    },

    _isCollectionDownloadable: function(collection) {
        var downloadHandlers = Portal.cart.DownloadHandler.handlersForDataCollection(collection);
        return downloadHandlers.length > 0;
    }
});
