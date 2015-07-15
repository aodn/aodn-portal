/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.cart');

Ext4.define('Portal.cart.NoDataInjector', { extend: 'Portal.cart.BaseInjector',

    constructor: function(config) {
        Portal.cart.NoDataInjector.superclass.constructor.call(this, Ext4.apply(this, config));
    },

    _getDataFilterEntry: function() {
        return OpenLayers.i18n('noDataMessage');
    },

    _getDataMarkup: function() {
        return '';
    }
});
