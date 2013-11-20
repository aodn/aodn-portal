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

    ROW_HEIGHT: 30,

    constructor: function(cfg){
        this.selectedProductInfoIndex = 0; // include a drop-down menu to change this index to support multiple products per Layer

        var config = Ext.apply({
            id: 'aodaacPanel',
            title: OpenLayers.i18n('aodaacPanelTitle'),
            bodyCls: 'aodaacTab',
            autoScroll: true
        }, cfg);

        Portal.details.AodaacPanel.superclass.constructor.call(this, config);
    },

    initComponent: function(){
        Portal.details.AodaacPanel.superclass.initComponent.call(this);
    },

    update: function(layer, show, hide, target){

        this.selectedLayer = layer;

        if (this.selectedLayer.isNcwms()) {

            Ext.Ajax.request({
                url: 'aodaac/productInfo?layerId=' + layer.grailsLayerId,
                scope: this,
                success: function(resp){

                    this.geoNetworkRecord = layer.parentGeoNetworkRecord;
                    this._updateGeoNetworkAodaac();
                    this.productsInfo = JSON.parse(resp.responseText);
                    this.selectedProductsInfo = this.productsInfo[ this.selectedProductInfoIndex ];

                    if (this.productsInfo.length > 0) {
                        var items = [];
                        this._addProductInfo(items);
                        this._addTemporalControls(items);
                        this.selectedLayer.processTemporalExtent();
                        this._addSpatialControls(items);
                        this.add(items);
                        this._populateFormFields();
                        this._showAllControls();
                        this.doLayout();

                        this.map.events.register("move", this, this._setBounds);

                        show.call(target, this);
                    }
                    else {
                        hide.call(target, this);
                    }
                },
                failure: function(){
                    hide.call(target, this);
                }
            });
        }
        else {
            // TODO hide the tab dudes
        }
    },

    _showAllControls: function(){
        this.spatialControls.show();
        this.temporalControls.show();
    },

    _populateFormFields: function(){
        // Remove productInfoText spinner
        this.remove(this.productInfoText);
        delete this.productInfoText;

        // Populate spatial extent controls this will also update the aodaac object in the record store
        // so please keep it last so all values are set
        this._setBounds();
    },

    _addProductInfo: function(items){

        // TODO - DN: Add product picker in case of multiple products per Layer
        this.productInfoText = this._newHtmlElement("<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\">&nbsp;<i>Loading...</i>");
        items.push(this.productInfoText, this._newSectionSpacer());
    },


    _addSpatialControls: function(items){
        var extents = this.productsInfo[ this.selectedProductInfoIndex ].extents;
        var spatialExtentHeader = this._newHtmlElement("<b>" + OpenLayers.i18n('spatialExtentHeading') + "</b>");
        var spatialExtentPossible = this._newHtmlElement("<small><i><b>" + OpenLayers.i18n('areaCoveredLabel') + "</b>: " +
            extents.lat.max + "<b>N</b>, " +
            extents.lon.min + "<b>W</b>, " +
            extents.lat.min + "<b>S</b>, " +
            extents.lon.max + "<b>E</b></i></small><br />");
        this.bboxControl = new Portal.details.BoundingBox({
            width: 150
        });

        // Group controls for hide/show
        this.spatialControls = new Ext.Container({
            items: [this._newSectionSpacer(), this._newSectionSpacer(), spatialExtentHeader, this.bboxControl, spatialExtentPossible, this._newSectionSpacer()],
            hidden: true
        });

        items.push(this.spatialControls);
    },

    _addTemporalControls: function(items) {
        var temporalExtentHeader = this._newHtmlElement("<b>" + OpenLayers.i18n('temporalExtentHeading') + "</b>");

        this.timeRangeLabel = this._newHtmlElement("<i>" + OpenLayers.i18n("loadingMessage") + "</i>");

        var dateStartLabel = new Ext.form.Label({
            html: OpenLayers.i18n('dateStartLabel'),
            width: 40
        });

        var dateEndLabel = new Ext.form.Label({
            html: OpenLayers.i18n('dateEndLabel'),
            width: 40
        });

        this.startDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateStartRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            width: '100%',
            height: this.ROW_HEIGHT,
            items: [
                dateStartLabel, this.startDateTimePicker
            ]
        });

        this.endDateTimePicker = new Portal.form.UtcExtentDateTime(this._defaultDateTimePickerConfiguration());

        var dateEndRow = new Ext.Panel({
            xtype: 'panel',
            layout: 'hbox',
            width: '100%',
            height: this.ROW_HEIGHT,
            items: [
                dateEndLabel, this.endDateTimePicker
            ]
        });

        this.previousFrameButton = new Ext.Button({
            iconCls : 'rewindButton',
            cls : "",
            margins: { top: 0, right: 5, bottom: 0, left: 0 },
            listeners : {
                scope : this,
                'click' : function() {
                    this._previousTimeSlice();
                }
            },
            tooltip : OpenLayers.i18n('selectTimePeriod', {direction: "Previous"})
        });

        this.nextFrameButton = new Ext.Button({
            iconCls : 'ffButton',
            cls : "",
            margins: { top: 0, right: 5, bottom: 0, left: 0 },
            listeners : {
                scope : this,
                'click' : function() {
                    this._nextTimeSlice();
                }
            },
            tooltip : OpenLayers.i18n('selectTimePeriod', {direction: "Next"})
        });

        this.label = new Ext.form.Label({
            html: "<h5>" + OpenLayers.i18n('selectMapTimePeriod', {direction: ""}) + "</h5>",
            margins: {top:0, right:10, bottom:0, left:10}
        });

        this.buttonsPanel = new Ext.Panel({
            layout : 'hbox',
            hidden: true,
            plain : true,
            items : [this.label, this.previousFrameButton, this.nextFrameButton],
            height : 40
        });

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [temporalExtentHeader, this._newSectionSpacer(), dateStartRow, dateEndRow, this.buttonsPanel, this.timeRangeLabel, this._newSectionSpacer()],
            hidden: true
        });

        this._attachTemporalEvents();

        items.push(this.temporalControls);
    },

    _defaultDateTimePickerConfiguration: function() {
        return {
            dateFormat: this.DATE_FORMAT,
            timeFormat: this.TIME_FORMAT,
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

    _newDateTimeLabel: function(html){
        return String.format("<small><i><b>{0}</b>: {1}<br/></i></small>", OpenLayers.i18n('currentDateTimeLabel'), html);
    },

    _newHtmlElement: function(html){
        return new Ext.Container({
            autoEl: 'div',
            html: html
        });
    },

    _newSectionSpacer: function(){
        return new Ext.Spacer({ height: 7 });
    },

    _setBounds: function(){
        var bounds = this.map.getExtent();
        this.bboxControl.setBounds(bounds);
        this._updateGeoNetworkAodaac();
    },

    _buildAodaac: function(){
        if (this.productsInfo && this.selectedProductsInfo) {
            return {
                productId: this.selectedProductsInfo.productId,
                dateRangeStart: this._formatDatePickerValueForAodaac(this.startDateTimePicker),
                dateRangeEnd: this._formatDatePickerValueForAodaac(this.endDateTimePicker),
                latitudeRangeStart: this.bboxControl.getSouthBL(),
                longitudeRangeStart: this.bboxControl.getWestBL(),
                latitudeRangeEnd: this.bboxControl.getNorthBL(),
                longitudeRangeEnd: this.bboxControl.getEastBL()
            };
        }
        return null;
    },

    _onDateSelected: function(datePicker, jsDate) {
        var selectedDateMoment = moment(jsDate);
        datePicker.setValue(selectedDateMoment);
        var selectedTimeMoment = moment.utc(datePicker.getValue());
        this._updateTimeRangeLabel(selectedTimeMoment);
        this._layerToTime(selectedTimeMoment);
    },

    _previousTimeSlice: function(){
        var time = this.selectedLayer.previousTimeSlice();
        this._updateTimeRangeLabel(time);
    },

    _nextTimeSlice: function() {
        var time = this.selectedLayer.nextTimeSlice();
        this._updateTimeRangeLabel(time);
    },

    _updateGeoNetworkAodaac: function() {
        if (this.geoNetworkRecord) {
            this.geoNetworkRecord.updateAodaac(this._buildAodaac());
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
        this.startDateTimePicker.setExtent(extent);
        this.startDateTimePicker.setValue(extent.min());
        this.endDateTimePicker.setExtent(extent);
        this.endDateTimePicker.setValue(extent.max(), true);
        this.buttonsPanel.show();
        this._updateTimeRangeLabel(extent.max());
    },

    _updateTimeRangeLabel: function(momentDate) {
        if (momentDate) {
            this.timeRangeLabel.update(this._newDateTimeLabel(momentDate.format('YYYY-MM-DD HH:mm:ss:SSS UTC')));
        }
    },

    _layerToTime: function(momentDate) {
        this.selectedLayer.toTime(momentDate);
    },

    _formatDatePickerValueForAodaac: function(datePicker) {
        this._formatDateForAodaac(datePicker.getValue());
    },

    _formatDateForAodaac: function(date) {
        return moment.utc(date).format('DD/MM/YYYY');
    }

});
