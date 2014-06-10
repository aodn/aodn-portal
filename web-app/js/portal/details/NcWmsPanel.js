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

    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'table',
            layoutConfig: {
                // The total column count must be specified here
                columns: 1,
                tableAttrs: {
                    cellspacing: '10px',
                    style: {
                        width: '100%'
                    }
                }
            },
            id: 'NcWmsPanel',
            bodyCls: 'aodaacTab',
            autoScroll: true
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addLoadingInfo();
        this._addSpatialConstraintDisplayPanel();
        this._addTemporalControls();
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
            layoutConfig: {
                align: 'middle'
            },
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
            items: [
                temporalExtentHeader,
                this._newSectionSpacer(5),
                dateStartRow,
                dateEndRow,
                this._newSectionSpacer(10),
                this.buttonsPanel,
                this.timeRangeLabel,
                this._newSectionSpacer(10)
            ]
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

    _newSectionSpacer: function(height) {
        return new Ext.Spacer({ height: height });
    },

    _buildParameters: function(parentAggr, selectedLayer, dateRangeStart, dateRangeEnd, geometry) {

        return parentAggr.buildParams(selectedLayer, dateRangeStart, dateRangeEnd, geometry);
    },

    _getParentRecordAggregator: function(selectedLayer) {

        var parentAggrGroup;
        var parentAggr;

        if (selectedLayer) {
            parentAggrGroup = selectedLayer.parentGeoNetworkRecord.data.aggregator.childAggregators;
        }

        Ext.each(parentAggrGroup, function(aggr) {
            if (aggr.supportsSubsettedNetCdf()) {
                parentAggr = aggr;
            }
        });

        return parentAggr;
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

        var dateRangeStart = this._getDateFromPicker(this.startDateTimePicker);
        var dateRangeEnd = this._getDateFromPicker(this.endDateTimePicker);
        var parentAggr = this._getParentRecordAggregator(this.selectedLayer);

        if (this.geoNetworkRecord && parentAggr) {
            this._addDateTimeFilterToLayer();
            this.geoNetworkRecord.updateNcwmsParams(this._buildParameters(parentAggr, this.selectedLayer, dateRangeStart, dateRangeEnd, geometry));
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
