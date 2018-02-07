Ext.namespace('Portal.details');

Portal.details.NcWmsPanel = Ext.extend(Ext.Container, {

    ROW_HEIGHT: 32,
    ROW_WIDTH: 270,

    PENDING_EVENT_ATTR: 'PENDING_EVENT',

    START_DATE: 'start date',
    END_DATE: 'end date',


    INFO_STYLES: {
        warning: "alert-warning",
        info: "alert-info"
    },

    geometryFilter: undefined,

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.layer = this.dataCollection.getLayerSelectionModel().getSelectedLayer();

        this.dataCollection.getLayerSelectionModel().on('selectedlayerchanged', function(newLayer) {
            this._onSelectedLayerChanged(newLayer);
        }, this);

        var config = Ext.apply({
            autoHeight: true,
            autoDestroy: true,
            cls: 'filterGroupPanel'
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addStatusInfo();
        this._addWarningMessageBox();
        this._addTemporalControls();
        this._addZAxisControls();
        this._addTimeRangeLabel();

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

    _addZAxisControls: function() {

        this.zAxisPickerTitle= OpenLayers.i18n('zAxisLabel');

        this.zAxisPickerStore = new Ext.data.ArrayStore({
            fields: [
                {name: this.zAxisPickerTitle, type: "integer" }
            ],
            expandData: true
        });

        this.zAxisFromPicker = this._getNewZaxisPicker(OpenLayers.i18n('fromLabelText'));
        this.zAxisToPicker = this._getNewZaxisPicker(OpenLayers.i18n('toLabelText'));

        this._resetZAxisPickersLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('clearLinkLabel', {text: String.format(OpenLayers.i18n('resetLabelText'), "Vertical slice")}),
            cls: 'clearFiltersLink',
            iconCls: 'small resetText',
            listeners: {
                scope: this,
                'click': this.resetZAxisPickers
            }
        });

        this.zAxisPickerContainer = new Ext.Container({
            hidden: true,
            items: [
                new Ext.Container({
                    html: String.format("<h4>{0}</h4>", this.zAxisPickerTitle)
                }),
                this._createHBoxRow(this._createHBoxLabel(OpenLayers.i18n('fromLabelText')), this.zAxisFromPicker),
                this._createHBoxRow(this._createHBoxLabel(OpenLayers.i18n('toLabelText')), this.zAxisToPicker),
                this._resetZAxisPickersLink,
                new Ext.Spacer({height: 30})
            ]
        });

        this.add(this.zAxisPickerContainer);
    },

    _getNewZaxisPicker: function(name) {
        return new Ext.form.ComboBox({
            comboName: name,
            parentScope: this,
            dataCollection: this.dataCollection,
            triggerAction: 'all',
            editable: false,
            displayField: this.zAxisPickerTitle,
            mode: "local",
            width: 100,
            store: this.zAxisPickerStore,
            validator: this.zAxisValidator,
            listeners: {
                scope: this,
                beforequery: function(combo) {
                    // Stop filtering on selection
                    this.lastQuery = null;
                    combo.query = '';
                    return true;
                },
                'select': function(combo) {
                    this.setZAxisValues(combo);
                },
                'render': function(combo) {
                    this.setZAxisComboDefaultValues(combo);
                }
            }
        });
    },

    zAxisValidator: function() {

        this.parentScope.zAxisFromPicker.clearInvalid();
        this.parentScope.zAxisToPicker.clearInvalid();

        if (this.parentScope.zAxisFromPicker.getValue() != undefined && this.parentScope.zAxisToPicker.getValue() != undefined) {

            var start = parseFloat(this.parentScope.zAxisFromPicker.getValue());
            var end   = parseFloat(this.parentScope.zAxisToPicker.getValue());

            if (start < end) {
                return String.format(OpenLayers.i18n('elevationLogicalError'), start, end);
            }
        }
        return true;
    },

    setZAxisComboDefaultValues: function(combo) {

        var fromVal = this.zAxisPickerStore.getRange()[0].data[this.zAxisPickerTitle].valueOf();
        var lastItem = this.zAxisPickerStore.getRange().length -1;
        var toVal = this.zAxisPickerStore.getRange()[lastItem].data[this.zAxisPickerTitle].valueOf();

        var value = (combo.comboName == OpenLayers.i18n('fromLabelText')) ? fromVal : toVal;
        combo.setValue(value);

        this.lastSelectedZAxisValue = fromVal;
        this._updateTimeRangeLabel();
    },

    setZAxisValues: function(combo) {
        if (combo.isValid()) {

            this.lastSelectedZAxisValue = combo.value;
            this.layer.setZAxis(combo.value); // last selected applies to map

            this._applyFilterValuesToCollection();
        }
    },

    getZAxisPickerValues: function() {
        if (this.zAxisFromPicker.isValid() && this.zAxisFromPicker.isValid()) {
            return String.format("{0}-{1}",
                this.zAxisFromPicker.getValue(),
                this.zAxisToPicker.getValue()
            );
        }
    },

    _extraLayerInfoLoaded: function(layer) {
        if (layer.extraLayerInfo.zaxis) {
            this.zAxisPickerStore.loadData(layer.extraLayerInfo.zaxis.values);
            this.zAxisPickerContainer.show();
        }
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
        this._hideStatusInfo();
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
            this.clearAndResetAllSubsets();
        }, this);
        this.add(this.resetLink);
    },

    clearAndResetAllSubsets: function() {
        if (Object.keys(this.layer.temporalExtent.extent).length > 0) {
            this._layerSetTime(this.layer.getTemporalExtentMax());
            this.pointTimeSeriesPanel._resetPanel();
            this.resetZAxisPickers();
            this.resetTemporalConstraints();
        }
    },

    resetZAxisPickers: function() {
        this.zAxisFromPicker.reset();
        this.zAxisToPicker.reset();
        this.layer.setZAxis();
    },

    clearAndResetTemporalConstraints: function() {
        this._layerSetTime(this.layer.getTemporalExtentMax());
        this.resetTemporalConstraints();
    },

    resetTemporalConstraints: function() {
        this._resetExtent(this.layer.getTemporalExtentMin(), this.layer.getTemporalExtentMax());
    },

    _hideStatusInfo: function() {
        this.loadingInfo.hide();
    },

    _showStatusInfo: function(msg, cls) {

        Ext.each(this.INFO_STYLES, function(style) {
            this.loadingInfo.removeClass(style);
        }, this);

        this.loadingInfo.addClass(cls);
        this.loadingInfo.update(msg);
        this.loadingInfo.show();
    },

    _addStatusInfo: function() {
        this.loadingInfo = new Ext.Container({
            autoEl: 'div',
            cls: 'alert spacer',
            html: OpenLayers.i18n('loadingMessage')
        });
        this.add(this.loadingInfo);
    },

    _addWarningMessageBox: function() {
        this.warningEmptyDownloadMessage = new Portal.common.AlertMessagePanel({
            message: OpenLayers.i18n('subsetRestrictiveFiltersText')
        });
        this.add(this.warningEmptyDownloadMessage);
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

        var dateStartLabel = this._createHBoxLabel(OpenLayers.i18n('fromLabelText'));
        var dateEndLabel = this._createHBoxLabel(OpenLayers.i18n('toLabelText'));

        this.startDateTimePicker = new Portal.form.UtcExtentDateTime(this._utcExtentDateTimePickerConfiguration(this.START_DATE));
        var dateStartRow = this._createHBoxRow(dateStartLabel, this.startDateTimePicker);

        this.endDateTimePicker = new Portal.form.UtcExtentDateTime(this._utcExtentDateTimePickerConfiguration(this.END_DATE));
        var dateEndRow = this._createHBoxRow(dateEndLabel, this.endDateTimePicker);

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
            margins: {top: 0, right: 10, bottom: 0, left: 0}
        });

        this._resetTemporalConstraintsLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('clearLinkLabel', {text: String.format(OpenLayers.i18n('resetLabelText'), "Dates")}),
            iconCls: 'small resetText',
            width: 80

        });
        this._resetTemporalConstraintsLink.on('click', function() {
            this.clearAndResetTemporalConstraints();
        }, this);


        this.mapTimeControls = new Ext.Panel({
            layout: 'hbox',
            cls: 'mapTimeControls',
            plain: true,
            items: [
                this.selectMapTimeLabel,
                this.previousFrameButton,
                this.nextFrameButton,
                new Ext.Spacer({width: 40}),
                this._resetTemporalConstraintsLink
            ],
            height: 30
        });

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [
                temporalExtentHeader,
                dateStartRow,
                dateEndRow,
                this._newSectionSpacer(10),
                this.mapTimeControls
            ]
        });

        this.add(this.temporalControls);
    },

    _createHBoxLabel: function(text) {
        return new Ext.form.Label({
            html: text,
            width: 40
        });
    },

    _createHBoxRow: function(label, field) {
        return new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            layoutConfig: {
                align: 'middle'
            },
            width: this.ROW_WIDTH,
            height: this.ROW_HEIGHT,
            items: [
                label, field
            ]
        });
    },

    _addTimeSeriesControls: function(cfg) {

        this.pointTimeSeriesPanel = new Portal.details.PointTimeSeriesPanel(cfg);
        this.add(this.pointTimeSeriesPanel);
    },

    areDatesTimesLogical: function(datePicker, dateTime) {

        if (this.startDateTimePicker.getValue() && this.endDateTimePicker.getValue()) {

            var start = dateTime;
            var end   = dateTime;

            if (datePicker.dateConfig.pickerType == this.START_DATE) {
                end = moment.utc(this.endDateTimePicker.getValue());
            }
            else {
                start = moment.utc(this.startDateTimePicker.getValue());
            }

            if (!this._isDateRangeValid(start, end)) {

                return String.format(OpenLayers.i18n('dateFormLogicalError'),
                    start.toISOString(),
                    end.toISOString()
                );
            }
        }
        return true;
    },

    areDatesLogical: function(datePicker) {

        if (this.endDateTimePicker.rendered && this.startDateTimePicker.rendered) {

            var start = (this.startDateTimePicker.getValue()) ? this.getMomentStartOfDay(this.startDateTimePicker.df.getValue()) : undefined;
            var end = (this.endDateTimePicker.getValue()) ? this.getMomentStartOfDay(this.endDateTimePicker.df.getValue()) : undefined;
            var date = moment(datePicker.getValue());

            (datePicker.pickerType == this.START_DATE) ? start = date : end = date;

            if (start && start.isValid() && end && end.isValid() && !this._isDateRangeValid(start,end)) {

                return String.format(OpenLayers.i18n('dateFormLogicalError'),
                        start.format(OpenLayers.i18n('dateTimeDisplayDayFormat')),
                        end.format(OpenLayers.i18n('dateTimeDisplayDayFormat'))
                    );
            }
        }
        return true;
    },

    getMomentStartOfDay: function(datetime) {
        return moment(datetime).startOf('day').clone();
    },

    _utcExtentDateTimePickerConfiguration: function(name) {

        var that = this;
        return {
            dateFormat: OpenLayers.i18n('dateDisplayFormatExtJs'),
            dateConfig: {
                pickerType: name,
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
                pickerType: name,
                editable: false,
                valueField: 'timeValue',
                displayField: 'displayTime'
            },
            flex: 2,
            listeners: {
                scope: this,
                change: this._onDateTimePickerChange
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

    _onDateTimePickerChange: function(datePicker, jsDate) {
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
        datePicker.tf.collapse();

        var valid = this.areDatesTimesLogical(datePicker, selectedDateTimeMoment);

        if (valid === true) {
            this._layerSetTime(selectedDateTimeMoment);
            this._setLayerSubsetExtent();
            this._setFrameButtonsState();
        }
        else {
            datePicker.markInvalid(valid);
        }

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
        if (this.isDestroyed !== true ) {

            var dateRangeStart = this._getUtcMomentFromPicker(this.startDateTimePicker);
            var dateRangeEnd = this._getUtcMomentFromPicker(this.endDateTimePicker);
            var geometry = this._getGeometryFilter();

            var zAxisValue =  this.getZAxisPickerValues();

            if (this._timeSeriesOptionAvailable()) {
                var pointFilterAvailable = this.pointTimeSeriesPanel._isTimeSeriesFilterAvailable();
                var pointFilterValue = {};
                if (pointFilterAvailable) {
                    pointFilterValue.latitude = this.pointTimeSeriesPanel._getTimeSeriesLatitude();
                    pointFilterValue.longitude = this.pointTimeSeriesPanel._getTimeSeriesLongitude();
                    pointFilterValue.errors = this.pointTimeSeriesPanel._getTimeSeriesFilterErrors();
                }
            }

            this.dataCollection.filters = this._ncwmsParamsAsFilters(dateRangeStart, dateRangeEnd, geometry, pointFilterAvailable, pointFilterValue, zAxisValue);

            this.dataCollection.isTemporalExtentSubsetted = this.isTemporalExtentSubsetted(dateRangeStart, dateRangeEnd);

            this.spatialSubsetIntersects = new Portal.filter.combiner.SpatialSubsetIntersectTester().testSpatialSubsetIntersect(this.dataCollection);
            this.setWarningBoxVisibility();
            this._updateTimeRangeLabel();
        }
    },

    _updateTimeRangeLabel: function() {
        this.timeRangeLabel.updateValues(this.layer, this.lastSelectedZAxisValue);
    },

    _addTimeRangeLabel: function() {
        this.timeRangeLabel = new Portal.ui.TimeRangeLabel();
        this.add(
            this._newSectionSpacer(10),
            this.timeRangeLabel,
            this._newSectionSpacer(10)
        );
    },

    setWarningBoxVisibility: function() {
        //this.warningEmptyDownloadMessage.setVisible(this.spatialSubsetIntersects === false); //todo - Hide for now
    },

    isTemporalExtentSubsetted: function(dateRangeStart, dateRangeEnd) {

        var temporalExtentBegin = this.layer.getTemporalExtentMin();
        var temporalExtentEnd = this.layer.getTemporalExtentMax();
        if (dateRangeStart && temporalExtentBegin && temporalExtentEnd) {
            return ! (dateRangeStart.isSame(temporalExtentBegin) && dateRangeEnd.isSame(temporalExtentEnd));
        }
        return undefined;

    },

    shouldHaveTemporalExtent: function() {
        var metadata = this.dataCollection.data.metadataRecord.data;
        return (metadata.temporalExtentBegin.length > 0) && (metadata.temporalExtentEnd.length > 0);
    },

    _isDateRangeValid: function(start, end) {
        if (start && start.isValid() && end && end.isValid()) {
            return  start.isSameOrBefore(end);
        }
        return false;
    },

    _ncwmsParamsAsFilters: function(dateRangeStart, dateRangeEnd, geometry, pointFilterAvailable, pointFilterValue, zAxisValue) {

        var dateFilterValue = {};
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

        if (!pointFilterAvailable && geometry) {
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

        var zAxisFilter = new Portal.filter.StringFilter({
            name: 'zaxis',
            label: this.zAxisPickerTitle,
            visualised: true,
            value: zAxisValue
        });


        return [
            realDateFilter,
            ncwmsParamsAsFilter,
            pointFilter,
            zAxisFilter
        ];
    },

    _attachTemporalEvents: function() {
        this.layer.events.on({
            'temporalextentloaded': this._layerTemporalExtentLoad,
            scope: this
        });

        this.layer.events.on({
            'extraLayerInfoloaded': this._extraLayerInfoLoaded,
            scope: this
        });
    },

    _resetExtent: function(extentMin, extentMax) {
        this._initializeDateTimePicker(this.startDateTimePicker, extentMin);
        this._initializeDateTimePicker(this.endDateTimePicker, extentMax);

        var extent = this.layer.getTemporalExtent();
        this._setDateTimePickerExtent(this.startDateTimePicker, extent, this.startDateTimePicker.initvalue, false);
        this._setDateTimePickerExtent(this.endDateTimePicker, extent, this.endDateTimePicker.initvalue, true);

        this._setLayerSubsetExtent();
        this._applyFilterValuesToCollection();
    },

    _initializeDateTimePicker: function(dateTimePicker, defaultValue) {
        if (this._getAttachedSelectedDate(dateTimePicker)) {
            var selectedDate = this._getAttachedSelectedDate(dateTimePicker).clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            var selectedTimeMoment = this.layer.getTemporalExtent().firstTimeOfDay(selectedDate);
            if (dateTimePicker.dateConfig.pickerType == this.END_DATE) {
                selectedTimeMoment = this.layer.getTemporalExtent().lastTimeOfDay(selectedDate);
            }
            dateTimePicker.initvalue = selectedTimeMoment.clone();
            this._removeAttachedSelectedDate(dateTimePicker);
            this._layerSetTime(selectedTimeMoment);
        }
        else {
            dateTimePicker.initvalue = defaultValue;
        }
    },

    _layerTemporalExtentLoad: function(layer) {

        if ((Object.keys(layer.temporalExtent.extent).length == 0)) {

            if (this.shouldHaveTemporalExtent()) {
                this._showStatusInfo(OpenLayers.i18n('unavailableTemporalExtent'), this.INFO_STYLES["warning"]);
            }
            else {
                this._showStatusInfo(OpenLayers.i18n('temporalExtentNotApplicable'), this.INFO_STYLES["info"]);
            }
            this.temporalControls.hide();
            this.pointTimeSeriesPanel.hide();
        }
        else {

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

                Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, this.dataCollection);
            }
            this._setFrameButtonsState();
        }
    },

    _setFrameButtonsState: function() {
        this.previousFrameButton.enable();
        this.nextFrameButton.enable();

        if (this.layer.temporalExtent.max().toString() == this.layer.time.toString()){
            this.nextFrameButton.disable();
        }

        if (this.layer.temporalExtent.min().toString() == this.layer.time.toString()){
            this.previousFrameButton.disable();
        }
    },

    _setDateTimePickerExtent: function(picker, extent, value, toMaxValue) {
        if (value) {
            picker.enable();
            picker.setExtent(extent);
            picker.setValue(value, toMaxValue);
        }
    },

    _layerSetTime: function(momentDate) {
        this.layer.setTime(momentDate);
    },

    _getUtcMomentFromPicker: function(datePicker) {
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
