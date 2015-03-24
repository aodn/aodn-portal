/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.NumberFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            layout: 'menu',
            layoutConfig: {
                padding: '5',
                align: 'left'
            },
            autoDestroy: true
        }, cfg);

        Portal.filter.ui.NumberFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {
        var label = new Ext.form.Label({
            html: "<label>" + this.filter.getLabel() + "</label>"
        });

        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            emptyText : OpenLayers.i18n("pleasePickCondensed"),
            width: 165,
            editable: false,
            fieldLabel: "Value",
            store: new Ext.data.ArrayStore({
                fields: [
                    'display', 'value'
                ],
                data: [
                    ['none', '0'],
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
            width: 146,
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.secondField = new Ext.form.TextField({
            name: 'to',
            width: 146,
            hidden: true,
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.add(label);
        this.add(this.operators);
        this.add(this.firstField);
        this.add(this.secondField);

        // Idea: show max/min values from this.filter.possibleValues
    },

    getFilterData: function() {

        return {
            name: this.filter.name,
            visualised: this.isVisualised(),
            cql: this.getCQL(),
            humanValue: this._getCQLHumanValue()
        }
    },

    handleRemoveFilter: function() {
        this.operators.clearValue();
        this.firstField.reset();
        this.secondField.reset();
        this.secondField.setVisible(false);
    },

    needsFilterRange: function() {
        return false
    },

    getCQL: function() {

        if (this.firstField.getValue()) {
            var cql = this.filter.getName() + " " + this.operators.getValue() + " " + this.firstField.getValue();

            if (this._operatorIsBetween()) {

                cql += " AND " + this.secondField.getValue();
            }

            return cql;
        }

        return undefined;
    },

    _getCQLHumanValue: function() {

        if (this.firstField.getValue()) {
            var cql = this.filter + " " + this.operators.getValue() + " " + this.firstField.getValue();

            if (this._operatorIsBetween()) {

                cql += " AND " + this.secondField.getValue();
            }

            return cql;
        }

        return undefined;
    },

    _onSpecialKeyPressed: function(field, e) {

        if (e.getKey() == e.ENTER) {

            this._updateFilter();
        }
    },

    _updateFilter: function(combo, record, index) {

        if (this.firstField.validate() && this.secondField.validate()) {

            var val = this._getTrackUsageLabel();

            this._fireAddEvent();

            if (!this._operatorIsBetween() || this._hasSecondValue()) {
                trackFiltersUsage('filtersTrackingNumberAction', val, this.layer.name);
            }
        }
    },

    _getTrackUsageLabel: function() {
        var label = this.filter.label + " " + this.operators.lastSelectionText + " " + this.firstField.getValue();

        if (this._operatorIsBetween()) {
            label = label + " and " + this.secondField.getValue();
        }

        return label;
    },

    _hasFirstValue: function() {
        return !(this.firstField.getValue() == null || this.firstField.getValue() == "");
    },

    _hasSecondValue: function() {
        return !(this.secondField.getValue() == null || this.secondField.getValue() == "");
    },

    _onOperationSelected: function(combo, record, index) {
        var shouldUpdate;
        var useSecondField = this._operatorIsBetween();
        var noneSelected = this._operatorIsNone();
        var hasFirstValue = this._hasFirstValue();
        var hasSecondValue = this._hasSecondValue();

        this.secondField.setVisible(useSecondField);

        shouldUpdate = useSecondField ? hasFirstValue && hasSecondValue : hasFirstValue;

        // Only change map if first value has a value
        if (shouldUpdate) {
            // clear the filter if "none" is selected
            if (noneSelected) {
                this.handleRemoveFilter();
                this._fireAddEvent();
            }
            else {
                this._fireAddEvent();
            }
        }
    },

    _operatorIsBetween: function() {
        return this.operators.getValue() == "BETWEEN";
    },

    _operatorIsNone: function() {
        return this.operators.getValue() == "0";
    }
});
