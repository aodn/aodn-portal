/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.AodaacPanel = Ext.extend(Ext.Panel, {

    DATE_FORMAT: 'Y-m-d',
    TIME_FORMAT: 'H:i \\U\\TC',

    ROW_HEIGHT: 32,

    constructor: function(cfg) {
        this.selectedProductInfoIndex = 0; // include a drop-down menu to change this index to support multiple products per Layer
        var config = Ext.apply({
            id: 'aodaacPanel',
            bodyCls: 'aodaacTab',
            autoScroll: true
        }, cfg);

        Portal.details.AodaacPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.AodaacPanel.superclass.initComponent.call(this);

        // TODO: I wonder if this spacing/layout could be done more neatly with CSS/padding etc?
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
            this._updateGeoNetworkAodaac(this.map.getConstraint());
            this._clearDateTimeFields();
            this.selectedLayer.processTemporalExtent();
            this._attachTemporalEvents();
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

        this._updateGeoNetworkAodaac(this.map.getConstraint());
    },

    _addLoadingInfo: function() {
        // TODO - DN: Add product picker in case of multiple products per Layer
        this.loadingInfo = this._newHtmlElement("<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\">&nbsp;<i>Loading...</i>");
        this.add(this.loadingInfo);
    },

    _addSpatialConstraintDisplayPanel: function() {
        this.map.events.on({
            scope: this,
            'spatialconstraintadded': function(geometry) {
                this._updateGeoNetworkAodaac(geometry);
            },
            'spatialconstraintcleared': function() {
                this._updateGeoNetworkAodaac();
            }
        });

        this.spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: this.map
        });
        this.add(this.spatialSubsetControlsPanel);
    },

    _addTemporalControls: function() {
        var temporalExtentHeader = this._newHtmlElement(String.format("<b>{0}</b>", OpenLayers.i18n('temporalExtentHeading')));

        this._updateTimeRangeLabel(null, true);

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
                select: this._onDateSelected,
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

    _newDateTimeLabel: function(html) {
        return String.format("<small><i><b>{0}</b>: {1}<br/></i></small>", OpenLayers.i18n('currentDateTimeLabel'), html);
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

    _addLabel: function(labelText) {
        var label = new Ext.form.Label({
            html: "<h4>" + labelText + "</h4>"
        });

        this.add(label);
    },

    _buildAodaacParameters: function(geometry) {
        if (this.productsInfo && this.selectedProductInfo) {

            var productExtents = this.selectedProductInfo.extents;

            var aodaacConfig = {
                productId: this.selectedProductInfo.productId,
                dateRangeStart: this._formatDatePickerValueForAodaac(this.startDateTimePicker),
                dateRangeEnd: this._formatDatePickerValueForAodaac(this.endDateTimePicker),
                productLatitudeRangeStart: productExtents.lat.min,
                productLongitudeRangeStart: productExtents.lon.min,
                productLatitudeRangeEnd: productExtents.lat.max,
                productLongitudeRangeEnd: productExtents.lon.max
            };

            if (geometry) {
                var bounds = geometry.getBounds();

                aodaacConfig.latitudeRangeStart = bounds.bottom;
                aodaacConfig.longitudeRangeStart = bounds.left;
                aodaacConfig.latitudeRangeEnd = bounds.top;
                aodaacConfig.longitudeRangeEnd = bounds.right;
            }

            return aodaacConfig;
        }

        return null;
    },

    _onDateSelected: function(datePicker, jsDate) {
        var selectedDateMoment = moment(jsDate);
        datePicker.setValue(selectedDateMoment);
        var selectedTimeMoment = moment.utc(datePicker.getValue());
        this._updateTimeRangeLabel(selectedTimeMoment);
        this._layerToTime(selectedTimeMoment);

        this._updateGeoNetworkAodaac(this.map.getConstraint());
    },

    _previousTimeSlice: function() {
        var time = this.selectedLayer.previousTimeSlice();
        this._updateTimeRangeLabel(time);
    },

    _nextTimeSlice: function() {
        var time = this.selectedLayer.nextTimeSlice();
        this._updateTimeRangeLabel(time);
    },

    _updateGeoNetworkAodaac: function(geometry) {
        if (this.geoNetworkRecord) {
            this.geoNetworkRecord.updateAodaac(this._buildAodaacParameters(geometry));
        }
    },

    _attachTemporalEvents: function() {
        this.selectedLayer.events.on({
            'temporalextentloaded': this._layerTemporalExtentLoaded,
            scope: this
        });
    },

    _layerTemporalExtentLoaded: function() {
        var extent = this.selectedLayer.getTemporalExtent();
        this._setDateTimePickerExtent(this.startDateTimePicker, extent, extent.min(), false);
        this._setDateTimePickerExtent(this.endDateTimePicker, extent, extent.max(), true);
        this.buttonsPanel.show();
        this._updateTimeRangeLabel(extent.max());

        this._updateGeoNetworkAodaac(this.map.getConstraint());
    },

    _setDateTimePickerExtent: function(picker, extent, value, toMaxValue) {
        picker.enable();
        picker.setExtent(extent);
        picker.setValue(value, toMaxValue);
    },

    _updateTimeRangeLabel: function(momentDate, loading) {
        if (!this.timeRangeLabel) {
            this.timeRangeLabel = this._newHtmlElement(String.format("<i>{0}</i>", OpenLayers.i18n("loadingMessage")));
        }

        if (this.timeRangeLabel.isVisible()) {
            if (momentDate) {
                this.timeRangeLabel.update(this._newDateTimeLabel(momentDate.format('YYYY-MM-DD HH:mm:ss:SSS UTC')));
            }
            else if (loading) {
                this.timeRangeLabel.update(String.format("<i>{0}</i>", OpenLayers.i18n("loadingMessage")));
            }
        }
    },

    _layerToTime: function(momentDate) {
        this.selectedLayer.toTime(momentDate);
    },

    _formatDatePickerValueForAodaac: function(datePicker) {
        return this._formatDateForAodaac(datePicker.getValue());
    },

    _formatDateForAodaac: function(date) {
        return moment.utc(date).format('DD/MM/YYYY');
    },

    _clearDateTimeFields: function() {
        this._resetAndDisableDateTimePicker(this.startDateTimePicker);
        this._resetAndDisableDateTimePicker(this.endDateTimePicker);
        this.buttonsPanel.hide();
        this._updateTimeRangeLabel(null, true);
    },

    _resetAndDisableDateTimePicker: function(picker) {
        picker.reset();
        picker.disable();
    }
});
