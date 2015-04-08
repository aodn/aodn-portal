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
            '{0} {1} {2}',
            this.getName(),
            this._getOperatorObject().cql,
            this._getFirstField()
        );

        if (this._getSecondField()) {

            cql = String.format(
                '{0} AND {1}',
                cql,
                this._getSecondField()
            );
        }

        return cql;
    },

    hasValue: function() {

        return this.getValue() && (this._getFirstField() || this._getSecondField());
    },

    getHumanReadableForm: function() {

        var cql = String.format(
            '{0} {1} {2}',
            this.getLabel(),
            this._getOperatorObject().cql,
            this._getFirstField()
        );

        if (this._getSecondField()) {

            cql = String.format(
                '{0} AND {1}',
                cql,
                this._getSecondField()
            );
        }

        return cql;
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
