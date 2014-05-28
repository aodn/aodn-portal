/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.DateFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'menu',
            layoutConfig: {
                padding: '5',
                align: 'left'
            }
        }, cfg);

        this.TIME_UTIL = new Portal.utils.TimeUtil();
        // Divide time zone offset by 60 to get total hours
        this.timeZoneCorrect = (new Date().getTimezoneOffset()) / -60;

        Portal.filter.DateFilterPanel.superclass.constructor.call(this, config);
    },

    _createField: function() {
        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            width: 165,
            editable: false,
            emptyText: OpenLayers.i18n("pleasePickCondensed"),
            fieldLabel: "Time",
            store: new Ext.data.ArrayStore({
                fields: [
                    'op'
                ],
                data: [
                    [OpenLayers.i18n("comboOptionNone")],
                    [OpenLayers.i18n("comboOptionBefore")],
                    [OpenLayers.i18n("comboOptionAfter")],
                    [OpenLayers.i18n("comboOptionBetween")]
                ]
            }),
            valueField: 'op',
            displayField: 'op',
            listeners: {
                scope: this,
                select: this._opSelect
            }
        });

        this.fromField = this._createDateField('from');
        this.toField = this._createDateField('to');

        this.add(this.operators);
        this.add(this.fromField);
        this.add(this.toField);

        if (this.filter.possibleValues != undefined) {
            this._setMinMax(this.fromField, this.filter.possibleValues);
            this._setMinMax(this.toField, this.filter.possibleValues);
        }
    },

    _createDateField: function(name) {
        return new Ext.form.DateField({
            name: name,
            format: "d/m/Y",
            hidden: true,
            maxValue: new Date(),
            minValue: new Date(0),
            width: 165,
            listeners: {
                scope: this,
                select: this._onSelect,
                change: this._onSelect
            }
        });
    },


    _formatDate: function(date) {
        return moment(date).format(OpenLayers.i18n('dateTimeDisplayFormat'));
    },

    _setMinMax: function(dateField, vals) {
        dateField.setMinValue(this.TIME_UTIL._parseIso8601Date(vals[0]));

        if (vals.length == 2) {
            dateField.setMaxValue(this.TIME_UTIL._parseIso8601Date(vals[1]));
        }
    },

    _opSelect: function(combo, row, index) {

        this._updateDateFieldsVisibility();

        if (this._isSelectedOpSetToNone()) {
            this.handleRemoveFilter();
            this._fireAddEvent();
        }
        else {
            this._applyDateFilterPanel();
        }
    },

    _isSelectedOpSetToNone: function() {
        return this.operators.getValue() == 'none';
    },

    _isSelectedOpSetToBetween: function() {
        return this.operators.getValue() == 'between';
    },

    _isSelectedOpSetToAfter: function() {
        return this.operators.getValue() == 'after';
    },

    _isSelectedOpSetToBefore: function() {
        return this.operators.getValue() == 'before';
    },

    _isFromFieldUsed: function() {
        return this._isSelectedOpSetToAfter() || this._isSelectedOpSetToBetween();
    },

    _isToFieldUsed: function() {
        return this._isSelectedOpSetToBefore() || this._isSelectedOpSetToBetween();
    },

    _updateDateFieldsVisibility: function() {
        this.fromField.setVisible(this._isFromFieldUsed());
        this.toField.setVisible(this._isToFieldUsed());
    },

    _getDateString: function(combo) {

        var newDate = combo.getValue();
        if (newDate) {
            newDate.setHours(this.timeZoneCorrect);
            return this.TIME_UTIL._toUtcIso8601DateString(newDate);
        }

        return '';
    },

    _getDateHumanString: function(combo) {

        var newDate = combo.getValue();
        if (newDate) {
            newDate.setHours(this.timeZoneCorrect);
            return this._formatDate(newDate);
        }

        return '';
    },

    _onSelect: function(picker, date) {
        if (this._isSelectedOpSetToBetween) {
            if (this.toField.isVisible()) {
                this.toField.setMinValue(this.fromField.getValue());
            }
        }
        this._applyDateFilterPanel();
    },

    _applyDateFilterPanel: function() {
        if (this._requiredFieldsSet()) {
            this._fireAddEvent();
        }
    },

    getFilterData: function() {

        return {
            name: this.filter.name,
            downloadOnly: this.isDownloadOnly(),
            cql: this._getCQL(),
            humanValue: this._getCQLHumanValue()
        }
    },

    _getCQLHumanValue: function() {

        var cql = '';

        if (this._isFromFieldUsed()) {
            cql = String.format("{0} >= {1}", "Start Date", this._getDateHumanString(this.fromField));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' <i>and</i> ';
        }

        if (this._isToFieldUsed()) {
            cql += String.format("{0} <= {1}", "End Date", this._getDateHumanString(this.toField));
        }

        return cql;
    },

    _getCQL: function() {

        var cql = '';

        if (this._isFromFieldUsed()) {
            cql = String.format("{0} >= {1}", this.filter.name, this._getDateString(this.fromField));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' AND ';
        }

        if (this._isToFieldUsed()) {
            cql += String.format("{0} <= {1}", this.filter.name, this._getDateString(this.toField));
        }

        return cql;
    },

    _requiredFieldsSet: function() {
        var requiredFields = [];

        requiredFields.push(this.operators.getValue());

        if (this._isFromFieldUsed()) {
            requiredFields.push(this.fromField.getValue());
        }

        if (this._isToFieldUsed()) {
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

        this._updateDateFieldsVisibility();

        this.toField.setMinValue(new Date(0));
    },

    _setExistingFilters: function() {
        var beforePattern = this.filter.name + " <= (.*?)( |$)";
        var afterPattern = this.filter.name + " >= (.*?)( |$)";

        var betweenRe = new RegExp(afterPattern + "AND " + beforePattern);
        var beforeRe = new RegExp(beforePattern);
        var afterRe = new RegExp(afterPattern);

        var m = beforeRe.exec(this.layer.getDownloadFilter());
        var m2 = afterRe.exec(this.layer.getDownloadFilter());
        var between = betweenRe.exec(this.layer.getDownloadFilter());

        if (between != null && between.length == 5) {
            this.operators.setValue('between');
            this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(between[1]));
            this.toField.setValue(this.TIME_UTIL._parseIso8601Date(between[3]));
        }
        else {
            if (m != null && m.length == 3) {
                this.operators.setValue('before');
                this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(m[1]));
            }
            else if (m2 != null && m2.length == 3) {
                this.operators.setValue('after');
                this.fromField.setValue(this.TIME_UTIL._parseIso8601Date(m2[1]));
            }
        }

        this._updateDateFieldsVisibility();
    }
});
