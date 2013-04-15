
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.NumberFilter = Ext.extend(Portal.filter.BaseFilter, {

    constructor: function(cfg) {

        var config = Ext.apply({
            autoDestroy: true
        }, cfg);

        Portal.filter.BaseFilter.superclass.constructor.call(this, config);
    },

    initComponent: function() {

        Portal.filter.BaseFilter.superclass.initComponent.call(this);
    },

    _createField: function() {

        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            width: 170,
            editable: false,
            fieldLabel: "Value",
            store: new Ext.data.ArrayStore({
                fields: [
                    'display', 'value'
                ],
                data: [
                    ['greater than', '>'],
                    ['greater than or equal to', '>='],
                    ['equal to', '='],
                    ['not equal to', '<>'],
                    ['less than', '<'],
                    ['less than or equal to', '<='],
                    ['between', 'BETWEEN']
                ]
            }),
            valueField: 'value',
            displayField: 'display',
            listeners:{
                scope: this,
                select: this._onOperationSelected
            }
        });

        this.firstField = new Ext.form.TextField({
            name: 'from',
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.secondField = new Ext.form.TextField({
            name: 'to',
            hidden: true,
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.add(this.operators);
        this.add(this.firstField);
        this.add(this.secondField);

        // Idea: show max/min values from this.filter.possibleValues
    },

    _createCQL: function(combo, record, index) {

        this.CQL = this.filter.name + " " + this.operators.getValue() + " " + this.firstField.getValue();

        if (this._operatorIsBetween()) {

            this.CQL += " AND " + this.secondField.getValue();
        }
    },

    _onSpecialKeyPressed: function(field, e) {

        if (e.getKey() == e.ENTER) {

            this._updateFilter();
        }
    },

    _updateFilter: function(combo, record, index) {

        if (this.firstField.validate() && this.secondField.validate()) {

            this._createCQL(combo, record, index);
            this._fireAddEvent();
        }
    },

    _onOperationSelected: function(combo, record, index) {

        var shouldUpdate;
        var useSecondField = this._operatorIsBetween();
        var hasFirstValue = !(this.firstField.getValue() == null || this.firstField.getValue() == "");
        var hasSecondValue = !(this.secondField.getValue() == null || this.secondField.getValue() == "");

        this.secondField.setVisible(useSecondField);

        shouldUpdate = useSecondField ? hasFirstValue && hasSecondValue : hasFirstValue;

        // Only change map if first value has a value
        if (shouldUpdate) {

            this._createCQL(combo, record, index);
            this._fireAddEvent();
        }
    },

    _operatorIsBetween: function() {

        return this.operators.getValue() == "BETWEEN";
    },

    handleRemoveFilter: function() {

        this.CQL = "";
        this.operators.clearValue();
        this.firstField.reset();
        this.secondField.reset();
        this.secondField.setVisible(false);
    },

    _setExistingFilters: function() {

        if(this.layer.params.CQL_FILTER != undefined){

            var name = this.filter.name;
            var num = "([+-]?\\d+(\\.\\d+)?)";

            this.re = new RegExp(name + " ((>|>=|=|<>|<|<=) " + num + "|BETWEEN " + num + " AND " + num + ")");

            var matches = this.re.exec(this.layer.params.CQL_FILTER);

            if (matches != null && matches.length == 9) {

                var singleValOperator = matches[2];
                var singleValValue = matches[3];
                var betweenValue1 = matches[5];
                var betweenValue2 = matches[7];

                if (singleValOperator != null && singleValValue != null) {

                    this.operators.setValue(singleValOperator);
                    this.firstField.setValue(singleValValue);
                }
                else if (betweenValue1 != null && betweenValue2 != null) {

                    this.operators.setValue('BETWEEN');
                    this.firstField.setValue(betweenValue1);
                    this.secondField.setValue(betweenValue2);
                    this.secondField.setVisible(true);
                }
            }
        }
    }
});
