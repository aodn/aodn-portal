/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.NcWmsPanel = Ext.extend(Ext.Container, {

    ROW_HEIGHT: 32,
    ROW_WIDTH: 255,

    PENDING_EVENT_ATTR: 'PENDING_EVENT',

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.layer = this.dataCollection.getSelectedLayer();

        var config = Ext.apply({
            cls: 'filterGroupPanel'
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addLoadingInfo();
        this._addTemporalControls();
        this._initWithLayer();
    },

    _initWithLayer: function() {

        this._disableDateTimeFields();
        this._attachTemporalEvents();
        this._attachSpatialEvents();
        this._removeLoadingInfo();
        this._applyFilterValuesFromMap();
        this._addClearButton();
    },

    _addClearButton: function() {
        this.resetLink = new Ext.ux.Hyperlink({
            cls: 'resetText clearFiltersLink small',
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('clearSubsetLabel')})
        });
        this.resetLink.on('click', function() {
            this.resetConstraints();
        }, this);
        this.add(this.resetLink);
    },

    resetConstraints: function() {
        this._resetExtent(this.layer.getTemporalExtentMin(), this.layer.getTemporalExtentMax());
    },

    _removeLoadingInfo: function() {
        this.remove(this.loadingInfo);
        delete this.loadingInfo;
    },

    _addLoadingInfo: function() {
        this.loadingInfo = this._newHtmlElement(OpenLayers.i18n('loadingMessage', {resource: ""}));
        this.add(this.loadingInfo);
    },

    _attachSpatialEvents: function() {
        if (!this.layer.attachedSpatialEvents) {

            var currentLayer = this.layer;
            this.map.events.on({
                scope: this,
                'spatialconstraintadded': function(geometry) {
                    this._applyFilterValuesToCollection(currentLayer, geometry);
                },
                'spatialconstraintcleared': function() {
                    this._applyFilterValuesToCollection(currentLayer, null);
                }
            });

            this.layer.attachedSpatialEvents = true;
        }
    },

    _addTemporalControls: function() {
        var temporalExtentHeader = this._newHtmlElement(String.format("<h4>{0}</h4>", OpenLayers.i18n('temporalExtentHeading')));

        this._initTimeRangeLabel();

        var dateStartLabel = new Ext.form.Label({
            html: OpenLayers.i18n('fromDateLabel'),
            width: 40,
            flex: 2
        });

        var dateEndLabel = new Ext.form.Label({
            html: OpenLayers.i18n('toDateLabel'),
            width: 40,
            flex: 2
        });

        this.startDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateStartRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            layoutConfig: {
                align: 'middle'
            },
            width: this.ROW_WIDTH,
            height: this.ROW_HEIGHT,
            items: [
                dateStartLabel, this.startDateTimePicker
            ]
        });

        this.endDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateEndRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            layoutConfig: {
                align: 'middle'
            },
            width: this.ROW_WIDTH,
            height: this.ROW_HEIGHT,
            items: [
                dateEndLabel, this.endDateTimePicker
            ]
        });

        this.previousFrameButton = new Ext.Button({
            iconCls: 'previousButton',
            cls: "",
            margins: { top: 0, right: 5, bottom: 0, left: 0 },
            listeners: {
                scope: this,
                'click': function () {
                    this._loadPreviousTimeSlice();
                }
            },
            tooltip: OpenLayers.i18n('selectTimePeriod', {direction: "Previous"})
        });

        this.nextFrameButton = new Ext.Button({
            iconCls: 'nextButton',
            cls: "",
            margins: { top: 0, right: 5, bottom: 0, left: 0 },
            listeners: {
                scope: this,
                'click': function () {
                    this._loadNextTimeSlice();
                }
            },
            tooltip: OpenLayers.i18n('selectTimePeriod', {direction: "Next"})
        });

        this.selectMapTimeLabel = new Ext.form.Label({
            html: "<h5>" + OpenLayers.i18n('selectMapTimePeriod') + "</h5>",
            margins: {top: 0, right: 10, bottom: 0, left: 10}
        });

        this.mapTimeControls = new Ext.Panel({
            layout: 'hbox',
            plain: true,
            items: [this.selectMapTimeLabel, this.previousFrameButton, this.nextFrameButton],
            height: 40
        });

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [
                temporalExtentHeader,
                dateStartRow,
                dateEndRow,
                this._newSectionSpacer(10),
                this.mapTimeControls,
                this.timeRangeLabel,
                this._newSectionSpacer(10)
            ]
        });

        this.add(this.temporalControls);
    },

    _defaultDateTimePickerConfiguration: function() {
        return {
            dateFormat: OpenLayers.i18n('dateDisplayFormatExtJs'),
            timeFormat: OpenLayers.i18n('timeDisplayFormatExtJs'),
            altDateFormats: OpenLayers.i18n('dateAltFormats'),
            flex: 2,
            listeners: {
                scope: this,
                change: this._onChange
            },
            timeConfig: {
                store: new Ext.data.JsonStore({
                    autoLoad: false,
                    autoDestroy: true,
                    fields: ['timeValue', 'displayTime']
                }),
                mode: 'local',
                triggerAction: "all",
                editable: false,
                valueField: 'timeValue',
                displayField: 'displayTime'
            }
        };
    },

    _newHtmlElement: function(html) {
        return new Ext.Container({
            autoEl: 'div',
            html: html
        });
    },

    _newSectionSpacer: function(height) {
        return new Ext.Spacer({ height: height });
    },

    _attachSelectedDateToPicker: function(datePicker, dateMoment) {
        if (dateMoment) {
            datePicker['selectedDate'] = dateMoment.clone();
        }
    },

    _getAttachedSelectedDate: function(datePicker) {
        return datePicker['selectedDate'];
    },

    _removeAttachedSelectedDate: function(datePicker) {
        delete datePicker['selectedDate'];
    },

    _onChange: function(datePicker, jsDate) {
        var selectedDateTimeMoment = moment(jsDate);
        var selectedDatePickerMoment = moment.utc(datePicker.getValue());

        // When comparing those two dates, we must make sure we perform a UTC
        // comparison. The pickers are in UTC.
        if (this.layer.getTemporalExtent()._isSameDay(selectedDatePickerMoment.utc(), selectedDateTimeMoment.utc())) {
            this._onTimeSelected(datePicker, selectedDateTimeMoment);
        }
        else {
            this._onDateSelected(datePicker, selectedDateTimeMoment);
        }
    },

    _onTimeSelected: function(datePicker, selectedDateTimeMoment) {
        datePicker.setValue(selectedDateTimeMoment);
        this._layerToTime(selectedDateTimeMoment);
        this._setLayerSubsetExtent();
        this._updateTimeRangeLabel();
        this._applyFilterValuesFromMap();
    },

    _onDateSelected: function(datePicker, selectedDateTimeMoment) {
        // Store selected date, so when we wake up from event, we know which
        // date to move to
        this._attachSelectedDateToPicker(datePicker, selectedDateTimeMoment);

        datePicker.setValue(selectedDateTimeMoment);

        this.layer.loadTimeSeriesForDay(selectedDateTimeMoment);
        // Now we wait for the event of 'temporalextentloaded'
    },

    _getPendingEvent: function() {
        return this[this.PENDING_EVENT_ATTR];
    },

    _attachPendingEvent: function(buttonClicked) {
        this[this.PENDING_EVENT_ATTR] = buttonClicked;
    },

    _removePendingEvent: function(datePicker) {
        delete this[this.PENDING_EVENT_ATTR];
    },

    _loadPreviousTimeSlice: function() {
        this._attachPendingEvent('previous');
        this.layer.getPreviousTimeSlice();
        // Now we wait for the event 'temporalextentloaded'
    },

    _goToPreviousTimeSlice: function() {
        this.layer.goToPreviousTimeSlice();
        this._updateTimeRangeLabel();
    },

    _loadNextTimeSlice: function() {
        this._attachPendingEvent('next');
        this.layer.getNextTimeSlice();
        // Now we wait for the event 'temporalextentloaded'
    },

    _goToNextTimeSlice: function() {
        this.layer.goToNextTimeSlice();
        this._updateTimeRangeLabel();
    },

    _applyFilterValuesFromMap: function() {

        this._applyFilterValuesToCollection(this.layer, this.map.getConstraint());
    },

    _applyFilterValuesToCollection: function(layer, geometry) {

        var dateRangeStart = this._getDateFromPicker(this.startDateTimePicker);
        var dateRangeEnd = this._getDateFromPicker(this.endDateTimePicker);

        if (this.dataCollection) {
            this._addDateTimeFilterToLayer();
            this.dataCollection.updateNcwmsParams(dateRangeStart, dateRangeEnd, geometry);
        }
    },

    _addDateTimeFilterToLayer: function() {

        if (this.layer) {

            var params = {};

            var start = moment(this.startDateTimePicker.getValue());
            if (start.isValid()) {
                params.dateRangeStart = start;
            }

            var end = moment(this.endDateTimePicker.getValue());
            if (end.isValid()) {
                params.dateRangeEnd = end;
            }

            this.layer.bodaacFilterParams = params;
        }
    },

    _attachTemporalEvents: function() {
        this.layer.events.on({
            'temporalextentloaded': this._layerTemporalExtentLoad,
            scope: this
        });
    },

    _resetExtent: function(extentMin, extentMax) {
        this._initializeDateTimePicker(this.startDateTimePicker, extentMin);
        this._initializeDateTimePicker(this.endDateTimePicker, extentMax);

        var extent = this.layer.getTemporalExtent();
        this._setDateTimePickerExtent(this.startDateTimePicker, extent, this.startDateTimePicker.initvalue, false);
        this._setDateTimePickerExtent(this.endDateTimePicker, extent, this.endDateTimePicker.initvalue, true);
        this._updateTimeRangeLabel();

        this._setLayerSubsetExtent();
    },

    _initializeDateTimePicker: function(dateTimePicker, defaultValue) {
        if (this._getAttachedSelectedDate(dateTimePicker)) {
            var selectedDate = this._getAttachedSelectedDate(dateTimePicker).clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            var selectedTimeMoment = this.layer.getTemporalExtent().firstTimeOfDay(selectedDate);
            dateTimePicker.initvalue = selectedTimeMoment.clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            this._layerToTime(selectedTimeMoment);
        }
        else {
            dateTimePicker.initvalue = defaultValue;
        }
    },

    _layerTemporalExtentLoad: function() {
        if ('next' == this._getPendingEvent()) {
            this._removePendingEvent();
            this._goToNextTimeSlice();
        }
        else if ('previous' == this._getPendingEvent()) {
            this._removePendingEvent();
            this._goToPreviousTimeSlice();
        }
        else {
            this._resetExtent(this.layer.getSubsetExtentMin(), this.layer.getSubsetExtentMax());
            this._applyFilterValuesFromMap();
        }
    },

    _setDateTimePickerExtent: function(picker, extent, value, toMaxValue) {
        if (value) {
            picker.enable();
            picker.setExtent(extent);
            picker.setValue(value, toMaxValue);
        }
    },

    _updateTimeRangeLabel: function() {
        this.timeRangeLabel.updateTime(this.layer.time.toUtcDisplayFormat());
    },

    _updateTimeRangeLabelLoading: function() {
        this.timeRangeLabel.loading();
    },

    _initTimeRangeLabel: function() {
        this.timeRangeLabel = new Portal.ui.TimeRangeLabel();
    },

    _layerToTime: function(momentDate) {
        this.layer.toTime(momentDate);
    },

    _getDateFromPicker: function(datePicker) {
        if (moment(datePicker.getValue()).isValid()) {
            return moment.utc(datePicker.getValue());
        }
    },

    _disableDateTimeFields: function() {
        this.startDateTimePicker.disable();
        this.endDateTimePicker.disable();
        this._updateTimeRangeLabelLoading();
    },

    _setLayerSubsetExtent: function() {
        if (this.layer) {
            this.layer.setSubsetExtentView(
                moment.utc(this.startDateTimePicker.getValue()),
                moment.utc(this.endDateTimePicker.getValue())
            );
        }
    }
});
