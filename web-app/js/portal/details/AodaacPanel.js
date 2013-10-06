
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.AodaacPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.selectedProductInfoIndex = 0; // include a drop-down menu to change this index to support multiple products per Layer

        var items = [];
        this._addProductInfo(items);
        this._addSpatialControls(items);
        this._addTemporalControls(items);

        var config = Ext.apply({
            id: 'aodaacPanel',
            title: OpenLayers.i18n('aodaacPanelTitle'),
            items: items,
            bodyCls: 'aodaacTab'
        }, cfg );

        Portal.details.AodaacPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.details.AodaacPanel.superclass.initComponent.call(this);

        this.map.events.register("move", this, this._setBounds);
    },

    update: function(layer, show, hide, target) {

        Ext.Ajax.request({
            url: 'aodaac/productInfo?layerId=' + layer.grailsLayerId,
            scope: this,
            success: function(resp) {

                this.geoNetworkRecord = layer.parentGeoNetworkRecord;
                this.productsInfo = JSON.parse(resp.responseText);

                if (this.productsInfo.length > 0) {

                    this._populateFormFields();
                    this._showAllControls();
                    this.doLayout();

                    show.call(target, this);
                }
                else {

                    hide.call(target, this);
                }
            },
            failure: function() {

                hide.call(target, this);
            }
        });
    },

    _showAllControls: function() {

        this.spatialControls.show();
        this.temporalControls.show();
    },

    _populateFormFields: function() {

        var productInfo = this.productsInfo[ this.selectedProductInfoIndex ];

        // Make 'Product info' text
        var maxTimeText = productInfo.extents.dateTime.max;
        var maxTimeValue = new Date();

        if (maxTimeText.trim() == "") {
            maxTimeText = ', ongoing'
        }
        else {
            maxTimeValue = maxTimeText;
            maxTimeText = " to " + maxTimeText;
        }

        var newText = "";
        newText += productInfo.name + "<br />";
        newText += OpenLayers.i18n('areaCoveredLabel') + productInfo.extents.lat.min + " N, " + productInfo.extents.lon.min + " E to " + productInfo.extents.lat.max + " N, " + productInfo.extents.lon.max + " E<br />";
        newText += OpenLayers.i18n('timeRangeLabel') + productInfo.extents.dateTime.min + maxTimeText + "<br />";

        // Replace productInfoText content
        this.remove(this.productInfoText);
        delete this.productInfoText;
        this.productInfoText = this._newHtmlElement(newText);
        this.insert(1, this.productInfoText);

        // Populate temporal extent controls
        var timeRangeStart = productInfo.extents.dateTime.min;
        var timeRangeEnd = productInfo.extents.dateTime.max;

        this.dateRangeStartPicker.setMinValue(timeRangeStart);
        this.dateRangeStartPicker.setValue(timeRangeStart);
        this.dateRangeStartPicker.setMaxValue(timeRangeEnd);

        this.dateRangeEndPicker.setMinValue(timeRangeStart);
        this.dateRangeEndPicker.setValue(maxTimeValue); // From above, handles 'ongoing' data sets
        this.dateRangeEndPicker.setMaxValue(timeRangeEnd);

        // Populate spatial extent controls this will also update the aodaac object in the record store
        // so please keep it last so all values are set
        this._setBounds();
    },

    _addProductInfo: function (items) {

        var productInfoHeader = this._newHtmlElement("<b>" + OpenLayers.i18n('productInfoHeading') + "</b>");

        // Todo - DN: Add product picker in case of multiple products per Layer

        this.productInfoText = this._newHtmlElement("<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\">&nbsp;<i>Loading...</i>");

        items.push(productInfoHeader, this.productInfoText, this._newSectionSpacer());
    },

    _newHtmlElement: function(html) {

        return new Ext.Container({
            autoEl: 'div',
            html: html
        });
    },

    _addSpatialControls: function(items) {

        var spatialExtentText = this._newHtmlElement("<b>" + OpenLayers.i18n('spatialExtentHeading') + "</b>");

        this.bboxControl = new Portal.details.BoundingBox({
            width: 300
        });

        // Group controls for hide/show
        this.spatialControls = new Ext.Container({
            items: [this._newSectionSpacer(), this._newSectionSpacer(), spatialExtentText, this.bboxControl, this._newSectionSpacer()],
            hidden: true
        });

        items.push(this.spatialControls);
    },

    _addTemporalControls: function(items) {

        var temporalExtentText = this._newHtmlElement("<b>" + OpenLayers.i18n('temporalExtentHeading') + "</b>");

        var target = this;

        this.timeRangeSlider = new Ext.slider.MultiSlider({
            id: 'timeExtentSlider',
            width: 190,
            minValue: 0,
            maxValue: 96, // (24 hours worth of 15 minute increments)
            values: [0, 96],
            plugins: new Ext.slider.Tip({
                getText: function(thumb){

                    // Get controls
                    var slider = thumb.slider;
                    var startThumb = slider.thumbs[0];
                    var endThumb = slider.thumbs[1];

                    // Format value for reading
                    var timeRangeStart = target._hoursFromThumb(startThumb);
                    var timeRangeEnd = target._hoursFromThumb(endThumb);

                    // Whole day message
                    var wholeDayMessage = "";
                    if (timeRangeStart == "0:00" && timeRangeEnd == "23:59") wholeDayMessage = "<br />(Whole day)";

                    // Emphasise value being modified
                    if (thumb == startThumb) timeRangeStart = "<span style=\"font-size: 1.4em;\">" + timeRangeStart + "</span>";
                    if (thumb == endThumb) timeRangeEnd = "<span style=\"font-size: 1.4em;\">" + timeRangeEnd + "</span>";

                    return String.format('{0}&nbsp;-&nbsp;{1}{2}', timeRangeStart, timeRangeEnd, wholeDayMessage);
                }
            }),
            listeners: {
                scope: this,
                changecomplete: this._updateGeoNetworkAodaac
            }
        });

        var timeRangeSliderContainer = new Ext.Panel({
            fieldLabel: OpenLayers.i18n('timeOfDayLabel'),
            height: 'auto',
            layout: 'column',
            items: [
                {
                    xtype: 'label',
                    text: "0:00",
                    style: "padding:0px; margin-top: 16px; margin-right: -32px;"
                },
                this.timeRangeSlider,
                {
                    xtype: 'label',
                    text: "23:59",
                    style: "padding: 0px; margin-top: 16px; margin-left: -28px;"
                }
            ]
        });

        // Calculate dates for max/min
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        var dateRangeStartPicker = {
            name: 'dateRangeStartPicker',
            ref: '../../dateRangeStartPicker',
            fieldLabel: OpenLayers.i18n('dateFromLabel'),
            labelSeparator: '',
            xtype: 'datefield',
            format: 'd/m/Y',
            anchor: '100%',
            showToday: false,
            maxValue: yesterday,
            listeners: {
                scope: this,
                change: this._updateGeoNetworkAodaac,
                select: this._updateGeoNetworkAodaac
            }
        };

        var dateRangeEndPicker = {
            name: 'dateRangeEndPicker',
            ref: '../../dateRangeEndPicker',
            fieldLabel: OpenLayers.i18n('dateToLabel'),
            labelSeparator: '',
            xtype: 'datefield',
            format: 'd/m/Y',
            anchor: '100%',
            showToday: true,
            maxValue: today, // Can't select date after today
            listeners: {
                scope: this,
                change: this._updateGeoNetworkAodaac,
                select: this._updateGeoNetworkAodaac
            }
        };

        var datePickers = {
            xtype: 'container',
            layout: 'form',
            width: 300,
            items: [ dateRangeStartPicker, dateRangeEndPicker, this._newSectionSpacer(), timeRangeSliderContainer]
        };

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [temporalExtentText, datePickers, this._newSectionSpacer()],
            hidden: true
        });

        items.push(this.temporalControls);
    },

    _newSectionSpacer: function() {

        return new Ext.Spacer({ height: 7 });
    },

    _convertTimeSliderValue: function(quarterHours) {

        // 'value' will be 0 - 96 (representing quarter-hours throughout the day)

        var fullHours = Math.floor(quarterHours / 4);
        var partHours = quarterHours % 4;

        var minutePart = ["00", "15", "30", "45"][partHours];
        var hourPart = fullHours;

        // Add leading zeros
        if (fullHours == 0) hourPart = '00';
        else if (fullHours < 10) hourPart = '0' + hourPart;

        return hourPart + '' + minutePart;
    },

    _hoursFromThumb: function(thumb) {

        var value = thumb.value;

        var fullHours = Math.floor(value / 4);
        var partHours = value % 4;

        var quarterHours = ["00", "15", "30", "45"];

        var returnValue = String.format("{0}:{1}", fullHours, quarterHours[partHours]);

        // Tweak not to show 24:00
        if (returnValue == "24:00") returnValue = "23:59";

        return returnValue;
    },

    _setBounds: function() {
        var bounds = this.map.getExtent();
        this.bboxControl.setBounds(bounds);
        this._updateGeoNetworkAodaac();
    },

    _updateGeoNetworkAodaac: function() {
        if (this.geoNetworkRecord) {
            this.geoNetworkRecord.updateAodaac(this._buildAodaac());
        }
    },

    _buildAodaac: function() {

        if (this.productsInfo && this.productsInfo[this.selectedProductInfoIndex]) {
            return {
                productId: this.productsInfo[this.selectedProductInfoIndex].productId,
                dateRangeStart: this.dateRangeStartPicker.value,
                dateRangeEnd: this.dateRangeEndPicker.value,
                timeOfDayRangeStart: this._convertTimeSliderValue(this.timeRangeSlider.thumbs[0].value),
                timeOfDayRangeEnd: this._convertTimeSliderValue(this.timeRangeSlider.thumbs[1].value),
                latitudeRangeStart: this.bboxControl.getSouthBL(),
                longitudeRangeStart: this.bboxControl.getWestBL(),
                latitudeRangeEnd: this.bboxControl.getNorthBL(),
                longitudeRangeEnd: this.bboxControl.getEastBL()
            };
        }
        return {};
    }
});
