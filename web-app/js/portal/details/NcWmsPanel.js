Ext.namespace('Portal.details');

Portal.details.NcWmsPanel = Ext.extend(Ext.Container, {

    ROW_HEIGHT: 32,
    ROW_WIDTH: 255,

    PENDING_EVENT_ATTR: 'PENDING_EVENT',

    START_DATE: 'start date',
    END_DATE: 'end date',

    geometryFilter: undefined,

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.layer = this.dataCollection.getLayerSelectionModel().getSelectedLayer();

        this.dataCollection.getLayerSelectionModel().on('selectedlayerchanged', function(newLayer) {
            this._onSelectedLayerChanged(newLayer);
        }, this);

        var config = Ext.apply({
            autoHeight: true,
            cls: 'filterGroupPanel'
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addLoadingInfo();
        this._addTemporalControls();

        if (this._timeSeriesOptionAvailable()) {
            this._addTimeSeriesControls({
                map: this.map,
                dataCollection: this.dataCollection,
                dataCollectionStore: this.dataCollectionStore
            });
        }

        this._initWithLayer();
        this._addClearButton();
    },

    _timeSeriesOptionAvailable: function() {
        var handlers = Portal.cart.DownloadHandler.handlersForDataCollection(this.dataCollection);

        var timeseriesHandlerFound = false;

        Ext.each(handlers, function(handler) {
            if (handler instanceof Portal.cart.PointCSVDownloadHandler) {
                timeseriesHandlerFound = true;
                return false;
            }
        });

        return timeseriesHandlerFound;
    },

    _initWithLayer: function() {
        this._attachTemporalEvents();
        this._attachSpatialEvents();
        this._removeLoadingInfo();
        this._applyFilterValuesToCollection();
    },

    _onSelectedLayerChanged: function(newLayer) {
        this.layer = newLayer;
        this._initWithLayer();
        this.resetTemporalConstraints();
    },

    _addClearButton: function() {
        this.resetLink = new Ext.ux.Hyperlink({
            cls: 'resetText clearFiltersLink small',
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('clearSubsetLabel')})
        });
        this.resetLink.on('click', function() {
            this.clearAndReset();
        }, this);
        this.add(this.resetLink);
    },

    clearAndReset: function() {
        this._layerSetTime(this.layer.getTemporalExtentMax());
        this.pointTimeSeriesPanel._resetPanel();
        this.resetTemporalConstraints();
    },

    resetTemporalConstraints: function() {
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

            this.map.events.on({
                scope: this,
                'spatialconstraintadded': function() {
                    this._applyFilterValuesToCollection();
                },
                'spatialconstraintcleared': function() {
                    this._applyFilterValuesToCollection();
                }
            });

            this.layer.attachedSpatialEvents = true;
        }
    },

    _getGeometryFilter: function() {
        return this.map.geometryFilter;
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

        this.startDateTimePicker = new Portal.form.UtcExtentDateTime(this._utcExtentDateTimePickerConfiguration(this.START_DATE));

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

        this.endDateTimePicker = new Portal.form.UtcExtentDateTime(this._utcExtentDateTimePickerConfiguration(this.END_DATE));

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
            disabled: true,
            margins: {top: 0, right: 5, bottom: 0, left: 0},
            listeners: {
                scope: this,
                'click': function() {
                    this._loadPreviousTimeSlice();
                }
            },
            tooltip: OpenLayers.i18n('selectTimePeriod', {direction: "Previous"})
        });

        this.nextFrameButton = new Ext.Button({
            iconCls: 'nextButton',
            cls: "",
            disabled: true,
            margins: {top: 0, right: 5, bottom: 0, left: 0},
            listeners: {
                scope: this,
                'click': function() {
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
            cls: 'mapTimeControls',
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
                this._newSectionSpacer(20)
            ]
        });

        this.add(this.temporalControls);
    },

    _addTimeSeriesControls: function(cfg) {

        this.pointTimeSeriesPanel = new Portal.details.PointTimeSeriesPanel(cfg);
        this.add(this.pointTimeSeriesPanel);
    },

    areDatesLogical: function(datePicker) {

        if (this.endDateTimePicker.rendered && this.startDateTimePicker.rendered) {

            var start = moment(this.startDateTimePicker.getValue()).clone();
            var end = moment(this.endDateTimePicker.getValue()).clone();
            var date = moment(datePicker.getValue()).clone();

            if (datePicker.pickerType == this.START_DATE) {
                start = date;
            }
            else {
                end = date;
            }

            if (start.isValid() && end.isValid() && !this._isDateRangeValid(start,end)) {
                return String.format(OpenLayers.i18n('dateFormLogicalError'),
                    start.format('Do MMMM YYYY'),
                    end.format('Do MMMM YYYY')
                );
            }
        }
        return true;
    },

    _utcExtentDateTimePickerConfiguration: function(name) {

        var that = this;
        var seleniumCls = name.replace(' ', '-');
        return {
            dateFormat: OpenLayers.i18n('dateDisplayFormatExtJs'),
            dateConfig: {
                scope: that,
                pickerType: name,
                cls: seleniumCls,
                validator: function() {
                    return that.areDatesLogical(this);
                }
            },
            timeFormat: OpenLayers.i18n('timeDisplayFormatExtJs'),
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
            },
            flex: 2,
            listeners: {
                scope: this,
                change: this._onChange
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
        return new Ext.Spacer({height: height});
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

        trackFiltersUsage(OpenLayers.i18n('trackingDateAction'), selectedDateTimeMoment.utc().toISOString(), this.dataCollection.getTitle());
    },

    _onTimeSelected: function(datePicker, selectedDateTimeMoment) {
        datePicker.setValue(selectedDateTimeMoment);
        this._layerSetTime(selectedDateTimeMoment);
        this._setLayerSubsetExtent();
        this._updateTimeRangeLabel();
        this._applyFilterValuesToCollection();
    },

    _onDateSelected: function(datePicker, selectedDateTimeMoment) {
        // Store selected date, so when we wake up from event, we know which
        // date to move to
        this._attachSelectedDateToPicker(datePicker, selectedDateTimeMoment);

        datePicker.setValue(selectedDateTimeMoment);

        if (datePicker.validate()) {
            this._applyFilterValuesToCollection(); // Set this date on the collection now. Fixes #1922
        }

        this.layer.loadTimeSeriesForDay(selectedDateTimeMoment);
        // Now we wait for the event of 'temporalextentloaded'
    },

    _getPendingEvent: function() {
        return this[this.PENDING_EVENT_ATTR];
    },

    _attachPendingEvent: function(buttonClicked) {
        this[this.PENDING_EVENT_ATTR] = buttonClicked;
    },

    _removePendingEvent: function() {
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

        trackLayerControlUsage(OpenLayers.i18n('trackingDateAction'), OpenLayers.i18n("trackingTimeSliceAction", {direction: "previous"}), this.dataCollection.getTitle());
    },

    _loadNextTimeSlice: function() {
        this._attachPendingEvent('next');
        this.layer.getNextTimeSlice();
        // Now we wait for the event 'temporalextentloaded'
    },

    _goToNextTimeSlice: function() {
        this.layer.goToNextTimeSlice();
        this._updateTimeRangeLabel();

        trackLayerControlUsage(OpenLayers.i18n('trackingDateAction'), OpenLayers.i18n("trackingTimeSliceAction", {direction: "next"}), this.dataCollection.getTitle());
    },

    _applyFilterValuesToCollection: function() {
        var dateRangeStart = this._getDateFromPicker(this.startDateTimePicker);
        var dateRangeEnd = this._getDateFromPicker(this.endDateTimePicker);
        var geometry = this._getGeometryFilter();

        if (this._timeSeriesOptionAvailable()){
            var pointFilterAvailable = this.pointTimeSeriesPanel._isTimeSeriesFilterAvailable();
            var lat = this.pointTimeSeriesPanel._getTimeSeriesLatitude();
            var lon = this.pointTimeSeriesPanel._getTimeSeriesLongitude();
        }
        this.dataCollection.filters = this._ncwmsParamsAsFilters(dateRangeStart, dateRangeEnd, geometry, pointFilterAvailable, lat, lon);
    },

    _isDateRangeValid: function(start, end) {
        if (start && start.isValid() && end && end.isValid()) {
            return  start.isSameOrBefore(end);
        }
        return false;
    },

    _ncwmsParamsAsFilters: function(dateRangeStart, dateRangeEnd, geometry, timeSeries, lat, lon) {

        var dateFilterValue = {};
        var pointFilterValue = {};
        var ncwmsParamsAsFilter = {
            name: 'nwmsParamsFilter',
            isNcwmsParams: true,
            hasValue: function() {
                return false;
            } // From the Portal.filter.Filter interface. Prevents filter from being used in CQL or displayed to user
        };

        if (this._isDateRangeValid(dateRangeStart, dateRangeEnd)) {
            ncwmsParamsAsFilter.dateRangeStart = dateRangeStart;
            dateFilterValue.fromDate = dateRangeStart.toDate();
            ncwmsParamsAsFilter.dateRangeEnd = dateRangeEnd;
            dateFilterValue.toDate = dateRangeEnd.toDate();
        }

        if (timeSeries) {
            pointFilterValue.latitude = parseFloat(lat);
            pointFilterValue.longitude = parseFloat(lon);
        }
        else if (geometry) {
            var bounds = geometry.getBounds();
            ncwmsParamsAsFilter.latitudeRangeStart = bounds.bottom;
            ncwmsParamsAsFilter.longitudeRangeStart = bounds.left;
            ncwmsParamsAsFilter.latitudeRangeEnd = bounds.top;
            ncwmsParamsAsFilter.longitudeRangeEnd = bounds.right; // 0 to 360
        }

        var realDateFilter = new Portal.filter.DateFilter({
            name: 'time',
            value: dateFilterValue,
            visualised: true
        });

        var pointFilter = new Portal.filter.PointFilter({
            name: 'timeSeriesAtPoint',
            value: pointFilterValue
        });

        return [
            realDateFilter,
            ncwmsParamsAsFilter,
            pointFilter
        ];
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
        this._applyFilterValuesToCollection();
    },

    _initializeDateTimePicker: function(dateTimePicker, defaultValue) {
        if (this._getAttachedSelectedDate(dateTimePicker)) {
            var selectedDate = this._getAttachedSelectedDate(dateTimePicker).clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            var selectedTimeMoment = this.layer.getTemporalExtent().lastTimeOfDay(selectedDate);
            dateTimePicker.initvalue = selectedTimeMoment.clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            this._layerSetTime(selectedTimeMoment);
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
            this._applyFilterValuesToCollection();
        }

        this._setFrameButtonsState();
    },

    _setFrameButtonsState: function() {
        this.previousFrameButton.enable();
        this.nextFrameButton.enable()

        if (this.layer.getSubsetExtentMax().toString() == this.layer.time.toString()){
            this.nextFrameButton.disable();
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

    _initTimeRangeLabel: function() {
        this.timeRangeLabel = new Portal.ui.TimeRangeLabel();
    },

    _layerSetTime: function(momentDate) {
        this.layer.setTime(momentDate);
    },

    _getDateFromPicker: function(datePicker) {
        if (moment(datePicker.getValue()).isValid()) {
            return moment.utc(datePicker.getValue());
        }
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
