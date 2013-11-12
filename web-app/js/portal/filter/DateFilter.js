/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.DateFilter = Ext.extend(Portal.filter.BaseFilter, {

    constructor: function(cfg) {
        var config = Ext.apply({}, cfg );

        this.TIME_UTIL = new Portal.utils.TimeUtil();
        Portal.filter.DateFilter.superclass.constructor.call(this, config);
    },

    _createField: function() {
        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            width: 100,
            editable: false,
            emptyText: OpenLayers.i18n("pleasePickCondensed"),
            fieldLabel: "Time",
            store: new Ext.data.ArrayStore({
                fields: [
                    'op'
                ],
                data: [['before'], ['after'], ['between']]
            }),
            valueField: 'op',
            displayField: 'op',
            listeners: {
                scope: this,
                select: this._opSelect
            }
        });

        this.fromField = new Ext.form.DateField({
            name: 'from',
            format: "d/m/Y",
            listeners: {
                scope: this,
                select: this._onSelect,
                change: this._onSelect
            }
        });

        this.toField = new Ext.form.DateField({
            name: 'to',
            format: "d/m/Y",
            hidden: true,
            listeners: {
                scope: this,
                select: this._onSelect,
                change: this._onSelect
            }
        });

        this.add(this.operators);
        this.add(this.fromField);
        this.add(this.toField);

        if (this.filter.possibleValues != undefined) {
            this._setMinMax(this.fromField, this.filter.possibleValues);
            this._setMinMax(this.toField, this.filter.possibleValues);
        }
    },

    _setMinMax: function(dateField, vals) {
        dateField.setMinValue(this.TIME_UTIL._parseIso8601Date(vals[0]));

        if (vals.length == 2) {
            dateField.setMaxValue(this.TIME_UTIL._parseIso8601Date(vals[1]));
        }
    },

    _opSelect: function(combo, row, index) {
        this.toField.setVisible(this._isSelectedOpSetToBetween());
        this._applyDateFilter();
    },

    _isSelectedOpSetToBetween: function() {
        return this.operators.getValue() != "" && this.operators.getValue() == 'between';
    },

    _getDateString: function(combo) {
          return this.TIME_UTIL._toUtcIso8601DateString(combo.getValue());
    },

    _onSelect: function(picker, date) {
        this._applyDateFilter();
    },

    _applyDateFilter: function() {
        if (this._requiredFieldsSet()) {
            this._createCQL();
            this._fireAddEvent();
        }
    },

    _createCQL: function() {
        this.CQL = this.filter.name + " ";

        if (this._isSelectedOpSetToBetween()) {
            this.CQL += "after " + this._getDateString(this.fromField) + " AND " + this.filter.name + " before " + this._getDateString(this.toField);
        }
        else {
            this.CQL += this.operators.getValue() + " " + this._getDateString(this.fromField);
        }
    },

    _requiredFieldsSet: function() {
        var requiredFields = [this.operators.getValue(), this.fromField.getValue()];
        if (this.operators.getValue() == 'between') {
            requiredFields.push(this.toField.getValue());
        }
        return this._all(requiredFields);
    },

    _all: function(array) {
        var ret = true;
        Ext.each(array, function(item, index, allItems) {
            if (!item) {
                ret = false;
            }
        }, this);

        return ret;
    },

    handleRemoveFilter: function() {
        this.operators.clearValue();
        this.toField.reset();
        this.fromField.reset();
        this.CQL = "";
    },

    _setExistingFilters: function() {
        var beforePattern = this.filter.name + " before (.*?)( |$)";
        var afterPattern = this.filter.name + " after (.*?)( |$)";

        betweenRe = new RegExp(afterPattern + "AND " + beforePattern);
        beforeRe = new RegExp(beforePattern);
        afterRe = new RegExp(afterPattern);

        var m = beforeRe.exec(this.layer.getDownloadFilter());
        var m2 = afterRe.exec(this.layer.getDownloadFilter());
        var between = betweenRe.exec(this.layer.getDownloadFilter());

        if (between != null && between.length == 5) {
            this.operators.setValue('between');
            this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(between[1]));
            this.toField.setVisible(true);
            this.toField.setValue(this.TIME_UTIL._parseIso8601Date(between[3]));
            this._createCQL();
        }
        else {
            if (m != null && m.length == 3) {
                this.operators.setValue('before');
                this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(m[1]));
                this._createCQL();
            }
            else if (m2 != null && m2.length == 3) {
                this.operators.setValue('after');
                this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(m2[1]));
                this._createCQL();
            }
        }
    }
});
