Ext.namespace('Portal.filter.ui');

Portal.filter.ui.NumberFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    OPERATOR_CLEAR: 'CLR',
    OPERATOR_BETWEEN: 'BTWN',
    OPERATOR_EMPTY: '',

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
            blankText: OpenLayers.i18n("pleasePickNumberOperator"),
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

        this.firstField = new Ext.form.NumberField({
            name: 'from',
            width: 146,
            allowNegative: true,
            allowBlank: false,
            blankText: OpenLayers.i18n("pleasePickNumberField"),
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.secondField = new Ext.form.NumberField({
            name: 'to',
            hidden: true,
            width: 146,
            allowNegative: true,
            allowBlank: false,
            blankText: OpenLayers.i18n("pleasePickNumberField"),
            listeners: {
                scope: this,
                blur: this._updateFilter,
                specialkey: this._onSpecialKeyPressed
            }
        });

        this.add(this.operators);
        this.add(this.firstField);
        this.add(this.secondField);

    },

    handleRemoveFilter: function() {
        this.operators.clearValue();
        this.firstField.reset();
        this.secondField.reset();
        this.secondField.setVisible(false);

        this.filter.clearValue();
    },

    needsFilterRange: function() {
        return false;
    },

    _onSpecialKeyPressed: function(field, e) {

        if (e.getKey() == e.ENTER) {
            this._updateFilter();
        }
    },

    _shouldUpdate: function() {

        if (this._operatorIsNotSet()) {
            this.operators.markInvalid(OpenLayers.i18n("pleasePickNumberOperator"));
            return;
        }
        else {
            return this._setGetFieldsStatus();
        }
    },

    _setGetFieldsStatus: function() {

        var validates = true;
        this.firstField.clearInvalid();
        this.secondField.clearInvalid();

        // both values set and operator is between
        if (this._operatorIsBetween()) {

            if (!this.firstField.validateValue() || !this.secondField.validateValue()) {
                validates = false;
            }

            if (parseInt(this.firstField.value) >= parseInt(this.secondField.value)) {
                validates = false;
                this.firstField.markInvalid(OpenLayers.i18n('numberFilterError'));
                this.secondField.markInvalid(OpenLayers.i18n('numberFilterError'));
            }
        }
        else if(!this._operatorIsBetween()) {
            this.firstField.validateValue();
        }
        return validates;
    },

    _updateFilter: function() {

        // Fixes #1696
        if (!this._shouldUpdate()) {
            return;
        }

        this.filter.setValue({
            firstField: this.firstField.getValue(),
            operator: this._getSelectedOperatorObject(),
            secondField: this.secondField.getValue()
        });

        if (this.firstField.getValue()) {
            trackFiltersUsage('filtersTrackingNumberAction', this._getTrackUsageLabel(), this.dataCollection.getTitle());
        }
    },

    _getTrackUsageLabel: function() {
        var label = this.filter.label + " " + this.operators.lastSelectionText + " " + this.firstField.getValue();

        if (this._operatorIsBetween()) {
            label = label + " and " + this.secondField.getValue();
        }

        return label;
    },

    _onOperationSelected: function() {

        this.secondField.setVisible(this._operatorIsBetween());

        this._updateFilter();

        if (this._operatorIsClear()) {
            this.handleRemoveFilter();
        }
    },

    _operatorIsBetween: function() {
        return this._getSelectedOperatorObject().code == this.OPERATOR_BETWEEN;
    },

    _operatorIsClear: function() {
        return this._getSelectedOperatorObject().code == this.OPERATOR_CLEAR;
    },

    _operatorIsNotSet: function() {
        return this.operators.getValue() == this.OPERATOR_EMPTY;
    },

    _getSelectedOperatorObject: function() {

        var store = this.operators.getStore();
        var selectedValue = this.operators.getValue();
        var index = store.find('code', selectedValue);
        var record = store.getAt(index);
        return record.data;
    }
});
