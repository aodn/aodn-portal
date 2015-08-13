/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.DateFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'form',
            labelSeparator: '',
            typeLabel: OpenLayers.i18n('temporalExtentHeading'),
            labelWidth: 35,
            layoutConfig: {
                align: 'left'
            }
        }, cfg);

        Portal.filter.ui.DateFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {
        this.fromDate = this._createResettableDate('fromDate', OpenLayers.i18n('fromDateLabel'), OpenLayers.i18n('fromDateEmptyText'));
        this.toDate = this._createResettableDate('toDate', OpenLayers.i18n('toDateLabel'), OpenLayers.i18n('toDateEmptyText'));

        if (this._shouldIncludeLabel()) {
            this._addLabel();
            this._addVerticalSpacer(5);
        }

        this.add(this.fromDate);
        this._addVerticalSpacer(5);
        this.add(this.toDate);

        if (this.filter.values != undefined) {
            this._setMinMax(this.fromDate, this.filter.values);
            this._setMinMax(this.toDate, this.filter.values);
        }
    },

    handleRemoveFilter: function() {
        this.fromDate.reset();
        this.toDate.reset();
        this.toDate.setMinValue(new Date(0));

        this.filter.clearValue();
    },

    needsFilterRange: function() {
        return false;
    },

    _addVerticalSpacer: function(sizeInPixels) {
        this.add(
            new Ext.Spacer({
                cls:'block',
                height: sizeInPixels
            })
        );
    },

    _shouldIncludeLabel: function() {

        return !this.filter.isPrimary();
    },

    _createResettableDate: function(name, fieldLabel, emptyText) {
        return new Portal.filter.ui.ResettableDate({
            name: name,
            fieldLabel: fieldLabel,
            emptyText: emptyText,
            listeners: {
                scope: this,
                change: this._applyDateFilter
            }
        });
    },

    _setMinMax: function(resettableDate, vals) {
        resettableDate.setMinValue(this.TIME_UTIL._parseIso8601Date(vals[0]));

        if (vals.length == 2) {
            resettableDate.setMaxValue(this.TIME_UTIL._parseIso8601Date(vals[1]));
        }
    },

    _applyDateFilter: function(component) {

        var changedField = component._dateField;

        this.toDate.setMinValue(this.fromDate.getValue());
        this.fromDate.setMaxValue(this.toDate.getValue());

        var usageLabelKey = changedField.getValue() ? 'trackingUserSet' : 'trackingDefaultValueReset';
        var val = changedField.name + " " + OpenLayers.i18n(usageLabelKey) + " " + changedField.getValue();
        trackFiltersUsage('filtersTrackingDateAction', val, this.dataCollection.getTitle());

        this.filter.setValue({
            fromDate: this.fromDate.getValue(),
            toDate: this.toDate.getValue()
        });

        this._fireAddEvent();
    }
});
