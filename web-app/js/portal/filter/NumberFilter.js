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

    _getCql: function(alternateLabel) {

        var cql = String.format(
            '{0} {1} {2}',
            alternateLabel ? alternateLabel : this.getName(),
            this._getOperator(),
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

    getHumanReadableForm: function() {

        return this._getCql(this.getLabel());
    },

    _getFirstField: function() {

        return this.getValue().firstField;
    },

    _getOperator: function() {

        return this.getValue().operator;
    },

    _getSecondField: function() {

        return this.getValue().secondField;
    }
});
