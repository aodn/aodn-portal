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
        this.fromDate = this._createResettableDate('fromDate', OpenLayers.i18n('fromLabelText'), OpenLayers.i18n('fromDateEmptyText'));
        this.toDate = this._createResettableDate('toDate', OpenLayers.i18n('toLabelText'), OpenLayers.i18n('toDateEmptyText'));

        if (this._shouldIncludeLabel()) {
            this._addLabel();
            this.add(this._createVerticalSpacer(5));
        }

        this.add(this.fromDate);
        this.add(this._createVerticalSpacer(5));
        this.add(this.toDate);

        if (this.filter.values != undefined) {
            this._setMinMax(this.fromDate, this.filter.values);
            this._setMinMax(this.toDate, this.filter.values);
        }
    },

    handleRemoveFilter: function() {
        this.fromDate.reset();
        this.toDate.reset();
        this.toDate.setMinimumValue(Portal.utils.Date.getEarliestPortalDate());

        this.filter.clearValue();
    },

    needsFilterRange: function() {
        return false;
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
        resettableDate.setMinimumValue(moment(vals[0]).toDate());

        if (vals.length == 2) {
            resettableDate.setMaximumValue(moment(vals[1]).toDate());
        }
    },

    _applyDateFilter: function(component) {

        var changedField = component._dateField;

        this.toDate.setMinimumValue(this.fromDate.getValue());
        this.fromDate.setMaximumValue(this.toDate.getValue());

        this.fromDate.isDateValid();
        this.toDate.isDateValid();

        var usageLabelKey = changedField.getValue() ? 'trackingUserSet' : 'trackingDefaultValueReset';
        var val = changedField.name + " " + OpenLayers.i18n(usageLabelKey) + " " + changedField.getValue();
        trackFiltersUsage('trackingDateAction', val, this.dataCollection.getTitle());

        this.filter.setValue({
            fromDate: this.fromDate.getValue(),
            toDate: this._endOfDay(this.toDate.getValue())
        });
    },

    _endOfDay: function(date) {
        if (date) {
            return moment(date).utc().endOf('day').toDate();
        }
    }
});
