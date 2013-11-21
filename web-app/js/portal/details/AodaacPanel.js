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

        // TODO: I wonder if this spacing/layout could be done more neatly with CSS/padding etc?
        items.push(this._newSectionSpacer());
        items.push(this._newSectionSpacer());
        items.push(this._newSectionSpacer());
        this._addBoundingBoxPanel(items);
        items.push(this._newSectionSpacer());
        this._addTemporalControls(items);
        items.push(this._newSectionSpacer());

        var config = Ext.apply({
            id: 'aodaacPanel',
            title: OpenLayers.i18n('aodaacPanelTitle'),
            items: items,
            bodyCls: 'aodaacTab',
            autoScroll: true
        }, cfg);

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

    _addProductInfo: function(items) {
        var productInfoHeader = this._newHtmlElement("<b>" + OpenLayers.i18n('productInfoHeading') + "</b>");

        // TODO - DN: Add product picker in case of multiple products per Layer

        this.productInfoText = this._newHtmlElement("<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\">&nbsp;<i>Loading...</i>");

        items.push(productInfoHeader, this.productInfoText);
    },

    _newHtmlElement: function(html) {
        return new Ext.Container({
            autoEl: 'div',
            html: html
        });
    },

    _addBoundingBoxPanel: function(items) {
        this.bboxControl = new Portal.details.BoundingBoxPanel({
            width: 300
        });

        items.push(this.bboxControl);
    },

    _addTemporalControls: function(items) {
        var temporalExtentText = this._newHtmlElement("<b>" + OpenLayers.i18n('temporalExtentHeading') + "</b>");

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
            items: [dateRangeStartPicker, dateRangeEndPicker]
        };

        // Group controls for hide/show
        this.temporalControls = new Ext.Container({
            items: [temporalExtentText, datePickers],
            hidden: true
        });

        items.push(this.temporalControls);
    },

    _newSectionSpacer: function() {
        return new Ext.Spacer({ height: 7 });
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
                latitudeRangeStart: this.bboxControl.getSouthBL(),
                longitudeRangeStart: this.bboxControl.getWestBL(),
                latitudeRangeEnd: this.bboxControl.getNorthBL(),
                longitudeRangeEnd: this.bboxControl.getEastBL()
            };
        }

        return null;
    }
});
