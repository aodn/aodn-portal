

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

        return this.getValue() && (this._getFirstField() || this._getFirstField() === 0);
    },

    getHumanReadableForm: function() {

        var firstOperand = this._getSecondField() ? this._getFirstField() : '';
        var secondOperand = this._getSecondField() ? this._getSecondField() : this._getFirstField();

        var value = String.format(
            '{0} {1} {2}',
            firstOperand,
            this._generateOperatorHtml(),
            secondOperand
        );

        return String.format(
            '{0}: {1}',
            this.getLabel(),
            value
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
    },

    _generateOperatorHtml: function() {

        var operator = this._getOperatorObject();
        return String.format(
            '<abbr title="{0}">{1}</abbr>',
            operator.text,
            operator.symbol
        );
    }
});
