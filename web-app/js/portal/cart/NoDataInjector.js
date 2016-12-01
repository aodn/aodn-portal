Ext.namespace('Portal.cart');

Portal.cart.NoDataInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.NoDataInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getInjectionJson: function(dataCollection) {
        var injectionJson = Portal.cart.NoDataInjector.superclass.getInjectionJson(dataCollection);
        injectionJson.errorMessage = OpenLayers.i18n('noDataMessage');
        return injectionJson;
    },

    _getDataMarkup: function() {
        return '';
    }
});
