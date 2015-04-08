/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.NumberFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['double', 'float', 'integer', 'int', 'long', 'short', 'decimal'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.NumberFilterPanel;
    },

    getCql: function() {

        var cql = String.format(
            this._getOperatorObject().cql,
            this._getFirstField(),
            this._getSecondField()
        );

        return String.format(
            '{0} {1}',
            this.getName(),
            cql
        );
    },

    hasValue: function() {

        return this.getValue() && (this._getFirstField() || this._getSecondField());
    },

    getHumanReadableForm: function() {

        var cql = String.format(
            this._getOperatorObject().cql,
            this._getFirstField(),
            this._getSecondField()
        );

        return String.format(
            '{0} {1}',
            this.getLabel(),
            cql
        );
    },

    _getFirstField: function() {

        return this.getValue().firstField;
    },

    _getOperatorObject: function() {

        return this.getValue().operator;
    },

    _getSecondField: function() {

        return this.getValue().secondField;
    }
});
