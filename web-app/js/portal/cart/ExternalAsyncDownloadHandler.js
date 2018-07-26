Ext.namespace('Portal.cart');

Portal.cart.ExternalAsyncDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function(filters) {
        throw 'Should be implemented by subclasses';
    },

    _getUrlGeneratorFunction: function() {
        throw 'Should be implemented by subclasses';
    },

    _buildServiceUrl: function() {
        throw 'Should be implemented by subclasses';
    },

    _showDownloadOptions: function() {
        throw 'Should be implemented by subclasses';
    }
});
