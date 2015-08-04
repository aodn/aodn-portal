

Ext.namespace('Portal.cart');

Portal.cart.NoDataInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.NoDataInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    _getDataFilterEntry: function() {
        return OpenLayers.i18n('noDataMessage');
    },

    _getDataMarkup: function() {
        return '';
    }
});
