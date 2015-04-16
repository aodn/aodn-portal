/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.NumberFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    OPERATOR_CLEAR: 'CLR',
    OPERATOR_BETWEEN: 'BTWN',

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
        this._addLabel();

        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            emptyText : OpenLayers.i18n("pleasePickCondensed"),
            width: 165,
            editable: false,
            fieldLabel: "Value",
            store: new Ext.data.ArrayStore({
                fields: OpenLayers.i18n('numberFilterOptionsFields'),
                data: OpenLayers.i18n('numberFilterDropdownOptions')
            }),
            valueField: 'code',
            displayField: 'text',
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

        this.add(this.operators);
        this.add(this.firstField);
        this.add(this.secondField);

        // Idea: show max/min values from this.filter.possibleValues
    },

    handleRemoveFilter: function() {
        this.operators.clearValue();
        this.firstField.reset();
        this.secondField.reset();
        this.secondField.setVisible(false);

        this.filter.clearValue();
    },

    needsFilterRange: function() {
        return false
    },

    _onSpecialKeyPressed: function(field, e) {

        if (e.getKey() == e.ENTER) {

            this._updateFilter();
        }
    },

    _updateFilter: function() {

        if (this.firstField.validate() && this.secondField.validate()) {

            this.filter.setValue({
                firstField: this.firstField.getValue(),
                operator: this._getSelectedOperatorObject(),
                secondField: this.secondField.getValue()
            });

            this._fireAddEvent();

            if (!this._operatorIsBetween() || this._hasSecondValue()) {
                trackFiltersUsage('filtersTrackingNumberAction', this._getTrackUsageLabel(), this.layer.name);
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

    _onOperationSelected: function() {
        var useSecondField = this._operatorIsBetween();
        var clearSelected = this._operatorIsClear();
        var hasFirstValue = this._hasFirstValue();
        var hasSecondValue = this._hasSecondValue();

        this.secondField.setVisible(useSecondField);

        var shouldUpdate = useSecondField ? hasFirstValue && hasSecondValue : hasFirstValue;

        if (shouldUpdate) {

            if (clearSelected) {
                this.handleRemoveFilter();
            }

            this._updateFilter();
        }
    },

    _operatorIsBetween: function() {
        return this.operators.getValue() == this.OPERATOR_BETWEEN;
    },

    _operatorIsClear: function() {
        return this.operators.getValue() == this.OPERATOR_CLEAR;
    },

    _getSelectedOperatorObject: function() {

        var store = this.operators.getStore();
        var selectedValue = this.operators.getValue();
        var index = store.find('code', selectedValue);
        var record = store.getAt(index);
        return record.data;
    }
});
