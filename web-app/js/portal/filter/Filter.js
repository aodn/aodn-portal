/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.Filter = Ext.extend(Object, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        Portal.filter.Filter.superclass.constructor.call(this, cfg);
    },

    setValue: function(value) {

        this.value = value;
    },

    getValue: function() {

        return this.value;
    },

    getName: function() {

        return this.name;
    },

    getLabel: function() {

        return this.label;
    },

    getType: function() {

        return this.type;
    },

    getVisualised: function() {

        return this.visualised;
    },

    getWmsStartDateName: function() {

        return this.wmsStartDateName;
    },

    getWmsEndDateName: function() {

        return this.wmsEndDateName;
    },

    getDataLayerCql: function() {

        return this._getCql();
    },

    getMapLayerCql: function() {

        return this._getCql();
    },

    getSupportedGeoserverTypes: function() {

        throw 'Subclasses must implement the getSupportedGeoserverTypes function'
    },

    getUiComponentConstructor: function() {

        throw 'Subclasses must implement the getUiComponentConstructor function'
    },

    getHumanReadableForm: function() {

        throw 'Subclasses must implement the getHumanReadableForm function'
    },

    _getCql: function() {

        throw 'Subclasses must implement the _getCql function OR must override both getDataLayerCql and getMapLayerCql'
    }
});
