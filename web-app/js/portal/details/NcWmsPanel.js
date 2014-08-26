/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.NcWmsPanel = Ext.extend(Ext.Panel, {

    ROW_HEIGHT: 32,
    ROW_WIDTH: 255,

    constructor: function(cfg) {

        this.layer = cfg.layer;

        var config = Ext.apply({
            layout: 'table',
            autoScroll: true,
            layoutConfig: {
                columns: 1,
                tableAttrs: {
                    cellspacing: '10px',
                    style: {
                        width: '100%'
                    }
                }
            }
        }, cfg);

        Portal.details.NcWmsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.NcWmsPanel.superclass.initComponent.call(this);

        this._addLoadingInfo();
        this._addSpatialConstraintDisplayPanel();
        this._addTemporalControls();

        this._initWithLayer();
    },

    _initWithLayer: function() {

        this.geoNetworkRecord = this.layer.parentGeoNetworkRecord;

        this._clearDateTimeFields();
        this._attachTemporalEvents();
        this._attachSpatialEvents();
        this.layer.processTemporalExtent();
        this._removeLoadingInfo();
        this._applyFilterValuesFromMap();
        this._addClearButton();
    },

    _addClearButton: function() {

        this.add(
            new Ext.Button({
                cls: "x-btn-text-icon",
                icon: "images/go-back-icon.png",
                text: OpenLayers.i18n('clearFilterButtonLabel'),
                listeners: {
                    scope: this,
                    click: this.resetConstraints
                }
            })
        );
    },

    resetConstraints: function() {

        this._clearDateTimeFields();
        this._layerTemporalExtentLoad();
        this._clearSpatialControls();
    },

    _clearSpatialControls: function() {

        if (this.map.spatialConstraintControl) {
            this.map.spatialConstraintControl.clear();
        }

        this.map.events.triggerEvent('spatialconstraintcleared');
    },

    _removeLoadingInfo: function() {
        this.remove(this.loadingInfo);
        delete this.loadingInfo;

    },

    _addLoadingInfo: function() {
        this.loadingInfo = this._newHtmlElement(OpenLayers.i18n('loadingSpinner', {resource: ""}));
        this.add(this.loadingInfo);
    },

    _addSpatialConstraintDisplayPanel: function() {

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: this.map
        });
        this.add(this.spatialSubsetControlsPanel);
    },

    _attachSpatialEvents: function() {
        if (!this.layer.attachedSpatialEvents) {

            var currentLayer = this.layer;
            currentLayer.map.events.on({
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
            dateFormat: OpenLayers.i18n('dateDisplayFormatExtJs'),
            timeFormat: OpenLayers.i18n('timeDisplayFormatExtJs'),
            altDateFormats: OpenLayers.i18n('dateAltFormats'),
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
        this.layer.previousTimeSlice();
        this._updateTimeRangeLabel();
    },

    _nextTimeSlice: function() {
        this.layer.nextTimeSlice();
        this._updateTimeRangeLabel();
    },

    _applyFilterValuesFromMap: function() {

        this._applyFilterValuesToCollection(this.layer, this.map.getConstraint());
    },

    _applyFilterValuesToCollection: function(layer, geometry) {

        var dateRangeStart = this._getDateFromPicker(this.startDateTimePicker);
        var dateRangeEnd = this._getDateFromPicker(this.endDateTimePicker);

        if (this.geoNetworkRecord) {
            this._addDateTimeFilterToLayer();
            this.geoNetworkRecord.updateNcwmsParams(dateRangeStart, dateRangeEnd, geometry);
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
        if (!this.layer.attachedTemporalExtentLoaded) {
            this.layer.events.on({
                'temporalextentloaded': this._layerTemporalExtentLoad,
                scope: this
            });
        }
    },

    _layerTemporalExtentLoad: function() {

        if (!this.layer.attachedTemporalExtentLoaded) {

            // save the defaults
            this.startDateTimePicker.initvalue = this.layer.getSubsetExtentMin();
            this.endDateTimePicker.initvalue = this.layer.getSubsetExtentMax();

            this.layer.attachedTemporalExtentLoaded = true;
        }

        var extent = this.layer.getTemporalExtent();
        this._setDateTimePickerExtent(this.startDateTimePicker, extent, this.startDateTimePicker.initvalue, false);
        this._setDateTimePickerExtent(this.endDateTimePicker, extent, this.endDateTimePicker.initvalue, true);
        this.buttonsPanel.show();
        this._updateTimeRangeLabel();

        this._applyFilterValuesFromMap();
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
        if (this.layer) {
            this.layer.setSubsetExtentView(
                moment.utc(this.startDateTimePicker.getValue()),
                moment.utc(this.endDateTimePicker.getValue())
            );
        }
    }
});
