/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.NcWmsPanel = Ext.extend(Ext.Panel, {

    DATE_FORMAT: 'Y-m-d',
    TIME_FORMAT: 'H:i \\U\\TC',

    ROW_HEIGHT: 32,

    LONG_MIN: -180,
    LONG_MAX: 180,
    LAT_MIN: -90,
    LAT_MAX: 90,

    constructor: function(cfg) {
        var config = Ext.apply({
            id: 'NcWmsPanel',
            bodyCls: 'aodaacTab',
            autoScroll: true
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addLoadingInfo();
        this.add(this._newSectionSpacer());
        this.add(this._newSectionSpacer());
        this.add(this._newSectionSpacer());
        this._addSpatialConstraintDisplayPanel();
        this.add(this._newSectionSpacer());
        this._addTemporalControls();
        this.add(this._newSectionSpacer());
    },

    handleLayer: function(layer, show, hide, target) {
        this.selectedLayer = layer;
        if (layer.isNcwms()) {
            this.geoNetworkRecord = layer.parentGeoNetworkRecord;

            this._applyFilterValuesFromMap();
            this._clearDateTimeFields();
            this._attachTemporalEvents(); // creates listener for completing processTemporalExtent
            this.selectedLayer.processTemporalExtent(); // triggers 'temporalextentloaded'
            this._removeLoadingInfo();
            this._showAllControls();

            show.call(target, this);
        }
        else {
            hide.call(target, this);
        }
    },

    _showAllControls: function() {
        this.temporalControls.show();
    },

    _removeLoadingInfo: function() {
        this.remove(this.loadingInfo);
        delete this.loadingInfo;

        this._applyFilterValuesFromMap();
    },

    _addLoadingInfo: function() {
        this.loadingInfo = this._newHtmlElement("<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\">&nbsp;<i>Loading...</i>");
        this.add(this.loadingInfo);
    },

    _addSpatialConstraintDisplayPanel: function() {
        this.map.events.on({
            scope: this,
            'spatialconstraintadded': function(geometry) {
                this._applyFilterValuesToCollection(geometry);
            },
            'spatialconstraintcleared': function() {
                this._applyFilterValuesToCollection();
            }
        });

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: this.map
        });
        this.add(this.spatialSubsetControlsPanel);
    },

    _addTemporalControls: function() {
        var temporalExtentHeader = this._newHtmlElement(String.format("<b>{0}</b>", OpenLayers.i18n('temporalExtentHeading')));

        this._initTimeRangeLabel();

        var dateStartLabel = new Ext.form.Label({
            html: OpenLayers.i18n('dateStartLabel'),
            width: 40,
            flex: 2
        });

        var dateEndLabel = new Ext.form.Label({
            html: OpenLayers.i18n('dateEndLabel'),
            width: 40,
            flex: 2
        });

        this.startDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateStartRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            width: 255,
            height: this.ROW_HEIGHT,
            items: [
                dateStartLabel, this.startDateTimePicker
            ]
        });

        this.endDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateEndRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            width: 255,
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
                    this._previousTimeSlice();
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
                    this._nextTimeSlice();
                }
            },
            tooltip: OpenLayers.i18n('selectTimePeriod', {direction: "Next"})
        });

        this.label = new Ext.form.Label({
            html: "<h5>" + OpenLayers.i18n('selectMapTimePeriod', {direction: ""}) + "</h5>",
            margins: {top: 0, right: 10, bottom: 0, left: 10}
        });

        this.buttonsPanel = new Ext.Panel({
            layout: 'hbox',
            hidden: true,
            plain: true,
            items: [this.label, this.previousFrameButton, this.nextFrameButton],
            height: 40
        });

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [temporalExtentHeader, this._newSectionSpacer(), dateStartRow, dateEndRow, this.buttonsPanel, this.timeRangeLabel, this._newSectionSpacer()]
        });

        this.add(this.temporalControls);
    },

    _defaultDateTimePickerConfiguration: function() {
        return {
            dateFormat: this.DATE_FORMAT,
            timeFormat: this.TIME_FORMAT,
            flex: 2,
            listeners: {
                scope: this,
                change: this._onDateSelected
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

    _newSectionSpacer: function() {
        return new Ext.Spacer({ height: 10 });
    },

    _buildParameters: function(geometry) {

        var config;

        if (this._isGogoduckLayer(this.selectedLayer.parentGeoNetworkRecord.data)) {
            config = this._buildGogoduckParams(geometry);
        }
        else if (this._isAodaacLayer(this.selectedLayer.parentGeoNetworkRecord.data)) {
            config = this._buildAodaacParams(geometry);
        }

        return config;
    },

    _buildAodaacParams: function(geometry) {

        var product = this.selectedLayer.aodaacProducts[0];
        var productExtents = product.extents;

        var aodaacConfig = {
            productId: product.id,
            dateRangeStart: this._getDateFromPicker(this.startDateTimePicker),
            dateRangeEnd:   this._getDateFromPicker(this.endDateTimePicker),
            productLatitudeRangeStart:  this._getMin(productExtents.lat),
            productLatitudeRangeEnd:    this._getMax(productExtents.lat),
            productLongitudeRangeStart: this._getMin(productExtents.lon),
            productLongitudeRangeEnd:   this._getMax(productExtents.lon)
        };

        if (geometry) {
            var bounds = geometry.getBounds();

            aodaacConfig.latitudeRangeStart  = bounds.bottom;
            aodaacConfig.longitudeRangeStart = bounds.left;
            aodaacConfig.latitudeRangeEnd    = bounds.top;
            aodaacConfig.longitudeRangeEnd   = bounds.right;
        }

        return aodaacConfig;
    },

    _buildGogoduckParams: function(geometry) {

        var ncwmsConfig = {
            layerName: this._selectedLayerWfsLayerName(),
            dateRangeStart: this._getDateFromPicker(this.startDateTimePicker),
            dateRangeEnd: this._getDateFromPicker(this.endDateTimePicker),
            productLatitudeRangeStart: this.LAT_MIN,
            productLongitudeRangeStart: this.LONG_MIN,
            productLatitudeRangeEnd: this.LAT_MAX,
            productLongitudeRangeEnd: this.LONG_MAX
        };

        if (geometry) {
            var bounds = geometry.getBounds();

            ncwmsConfig.latitudeRangeStart = bounds.bottom;
            ncwmsConfig.longitudeRangeStart = bounds.left;
            ncwmsConfig.latitudeRangeEnd = bounds.top;
            ncwmsConfig.longitudeRangeEnd = bounds.right;
        }

        return ncwmsConfig;
    },

    _isAodaacLayer: function(collection) {
        var aodaac = false;

        Ext.each(collection.aggregator, function(aggregator, index) {
            if (aggregator.isAodaacLayer()) {
                aodaac = true;
            }
        });

        return aodaac;
    },

    _isGogoduckLayer: function(collection) {
        var gogoduck = false;

        Ext.each(collection.aggregator, function(aggregator, index) {
            if (aggregator.isGogoduckLayer()) {
                gogoduck = true;
            }
        });

        return gogoduck;
    },

    _selectedLayerWfsLayerName: function() {
        var name;

        if (this.selectedLayer.wfsLayer) {
            name = this.selectedLayer.wfsLayer.name;
        }

        return name;
    },

    _onDateSelected: function(datePicker, jsDate) {
        var selectedDateMoment = moment(jsDate);
        datePicker.setValue(selectedDateMoment);
        var selectedTimeMoment = moment.utc(datePicker.getValue());
        this._layerToTime(selectedTimeMoment);
        this._setLayerSubsetExtent();
        this._updateTimeRangeLabel();

        this._applyFilterValuesFromMap();
    },

    _previousTimeSlice: function() {
        this.selectedLayer.previousTimeSlice();
        this._updateTimeRangeLabel();
    },

    _nextTimeSlice: function() {
        this.selectedLayer.nextTimeSlice();
        this._updateTimeRangeLabel();
    },

    _applyFilterValuesFromMap: function() {

        this._applyFilterValuesToCollection(this.map.getConstraint());
    },

    _applyFilterValuesToCollection: function(geometry) {
        if (this.geoNetworkRecord) {

            this._addDateTimeFilterToLayer(geometry);

            this.geoNetworkRecord.updateNcwmsParams(this._buildParameters(geometry));
        }
    },

    _addDateTimeFilterToLayer: function() {

        if (this.selectedLayer) {
            this.selectedLayer.bodaacFilterParams = {
                dateRangeStart: moment(this.startDateTimePicker.getValue()),
                dateRangeEnd: moment(this.endDateTimePicker.getValue())
            };
        }
    },

    _attachTemporalEvents: function() {
        if (!this.selectedLayer.attachedTemporalExtentLoaded) {
            this.selectedLayer.events.on({
                'temporalextentloaded': this._layerTemporalExtentLoaded,
                scope: this
            });

            this.selectedLayer.attachedTemporalExtentLoaded = true;
        }
    },

    _layerTemporalExtentLoaded: function() {
        var extent = this.selectedLayer.getTemporalExtent();
        this._setDateTimePickerExtent(this.startDateTimePicker, extent, this.selectedLayer.getSubsetExtentMin(), false);
        this._setDateTimePickerExtent(this.endDateTimePicker, extent, this.selectedLayer.getSubsetExtentMax(), true);
        this.buttonsPanel.show();
        this._updateTimeRangeLabel();

        this._applyFilterValuesFromMap();
    },

    _setDateTimePickerExtent: function(picker, extent, value, toMaxValue) {
        picker.enable();
        picker.setExtent(extent);
        picker.setValue(value, toMaxValue);
    },

    _updateTimeRangeLabel: function() {
        this.timeRangeLabel.updateTime(this.selectedLayer.time.toUtcDisplayFormat());
    },

    _updateTimeRangeLabelLoading: function() {
        this.timeRangeLabel.loading();
    },

    _initTimeRangeLabel: function() {
        this.timeRangeLabel = new Portal.ui.TimeRangeLabel();
    },

    _layerToTime: function(momentDate) {
        this.selectedLayer.toTime(momentDate);
    },

    _getDateFromPicker: function(datePicker) {
        if (moment(datePicker.getValue()).isValid()) {
            return moment.utc(datePicker.getValue());
        }
    },

    _getMin: function(values) {

        return values[0];
    },

    _getMax: function(values) {

        return values[1];
    },

    _clearDateTimeFields: function() {
        this._resetAndDisableDateTimePicker(this.startDateTimePicker);
        this._resetAndDisableDateTimePicker(this.endDateTimePicker);
        this.buttonsPanel.hide();
        this._updateTimeRangeLabelLoading();
    },

    _resetAndDisableDateTimePicker: function(picker) {
        picker.reset();
        picker.disable();
    },

    _setLayerSubsetExtent: function() {
        if (this.selectedLayer) {
            this.selectedLayer.setSubsetExtentView(
                moment.utc(this.startDateTimePicker.getValue()),
                moment.utc(this.endDateTimePicker.getValue())
            );
        }
    }
});
