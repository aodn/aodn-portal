Ext.namespace('Portal.details');

Portal.details.PointTimeSeriesPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.map = cfg.map;
        this.createComponents();

        var config = Ext.apply({
            cls: 'pointTimeSeriesPanel',
            items: [
                this.pointTimeSeriesCheckbox,
                new Ext.Spacer({height: 10}),
                {
                    xtype: 'label',
                    text: OpenLayers.i18n('latitudeLabel')
                },
                this.timeSeriesLatitudeControl,
                {
                    xtype: 'label',
                    text: OpenLayers.i18n('longitudeLabel'),
                    style: 'margin: 0 0 0 10px'
                },
                this.timeSeriesLongitudeControl,
                new Ext.Spacer({height: 10})
            ]
        }, cfg);

        this.addMapEvents();

        Portal.details.PointTimeSeriesPanel.superclass.constructor.call(this, config);
    },

    createComponents: function() {

        this.timeSeriesLatitudeControl = new Ext.form.NumberField({
            decimalPrecision: 7,
            readOnly: true,
            allowBlank: false,
            blankText: String.format(OpenLayers.i18n('enableTimeSeriesDialog'), OpenLayers.i18n('latitudeLabel')),
            emptyText: OpenLayers.i18n('emptyText'),
            width: 70,
            minValue : -90,
            maxValue : 90,
            minText : "The minimum allowed latitude (EPSG:4326) is {0}",
            maxText : "The maximum allowed latitude (EPSG:4326) is {0}",
            style: 'margin: 0 0 0 15px',
            listeners: {
                scope: this,
                render: function(c) {
                    this._addTimeSeriesQuickTip(c);
                },
                change: function(c) {
                    this._applyTimeSeriesFilterValuesToCollection();
                }
            }
        });

        this.timeSeriesLongitudeControl = new Ext.form.NumberField({
            decimalPrecision: 7,
            readOnly: true,
            allowBlank: false,
            blankText: String.format(OpenLayers.i18n('enableTimeSeriesDialog'), OpenLayers.i18n('longitudeLabel')),
            emptyText: OpenLayers.i18n('emptyText'),
            width: 70,
            style: 'margin: 0 0 0 15px',
            minValue : -180,
            maxValue : 180,
            minText : "The minimum allowed longitude (EPSG:4326) is {0}",
            maxText : "The maximum allowed longitude (EPSG:4326) is {0} \n(Limit is 180)",
            listeners: {
                scope: this,
                render: function(c) {
                    this._addTimeSeriesQuickTip(c);
                },
                change: function(c) {
                    this._applyTimeSeriesFilterValuesToCollection();
                }
            }
        });

        this.pointTimeSeriesCheckbox = new Ext.form.Checkbox({
            boxLabel: OpenLayers.i18n('pointTimeSeriesLabel'),
            cls: 'checkboxLabel',
            checked: false,
            listeners: {
                scope: this,
                check: {
                    fn: function(checkbox, isChecked) {
                        this._onPointTimeSeriesCheckBoxChange(isChecked);
                    }
                }
            }
        });
    },

    addMapEvents: function() {
        if (this.map) {
            this.map.events.on({
                scope: this,
                'featureInfoClick': this.updatePoint
            });
        }
    },

    updatePoint: function(e) {
        if (e) {
            var xys = this.map.getLonLatFromViewPortPx(e.xy);
            this.timeSeriesLatitudeControl.setValue(toNSigFigs(xys.lat, 4));
            this.timeSeriesLongitudeControl.setValue(toNSigFigs(xys.lon, 4));
            this._applyTimeSeriesFilterValuesToCollection();
            animateNumberField(this.getItemId());
            Event.stop(e);
        }
    },

    _onPointTimeSeriesCheckBoxChange: function(isChecked) {
        if (isChecked) {
            this._enablePointTimeSeriesControls();
        }
        else {
            this._disablePointTimeSeriesControls();
        }
        this._applyTimeSeriesFilterValuesToCollection();
    },

    _enablePointTimeSeriesControls: function() {
        this.timeSeriesLatitudeControl.setReadOnly(false);
        this.timeSeriesLatitudeControl.validate();
        this._removeQuickTip(this.timeSeriesLatitudeControl);
        this.timeSeriesLongitudeControl.setReadOnly(false);
        this.timeSeriesLongitudeControl.validate();
        this._removeQuickTip(this.timeSeriesLongitudeControl);
    },

    _disablePointTimeSeriesControls: function() {
        this.timeSeriesLatitudeControl.setReadOnly(true);
        this.timeSeriesLatitudeControl.clearInvalid();
        this._addTimeSeriesQuickTip(this.timeSeriesLatitudeControl);
        this.timeSeriesLongitudeControl.setReadOnly(true);
        this.timeSeriesLongitudeControl.clearInvalid();
        this._addTimeSeriesQuickTip(this.timeSeriesLongitudeControl);
    },

    _addTimeSeriesQuickTip: function(component) {
        Ext.QuickTips.register({
            target: component.getEl(),
            text: String.format(OpenLayers.i18n('enableTimeSeriesEditing'), OpenLayers.i18n('pointTimeSeriesLabel')),
            enabled: true,
            showDelay: 0,
            trackMouse: true,
            autoShow: true
        });
    },

    _removeQuickTip: function(component) {
        Ext.QuickTips.unregister(component.getEl());
    },

    _applyTimeSeriesFilterValuesToCollection: function() {

        // Create or modify filter 'timeSeriesAtPoint' and disable the spatial filter
        if (this._getTimeSeriesFilter()) {

            var pointFilterValue = {};
            pointFilterValue.latitude = this.timeSeriesLatitudeControl.getValue();
            pointFilterValue.longitude = this.timeSeriesLongitudeControl.getValue();

            var timeSeriesAtPoint = Portal.filter.FilterUtils.getFilter(this.dataCollection.filters,"timeSeriesAtPoint");
            var nwmsParamsFilter =  Portal.filter.FilterUtils.getFilter(this.dataCollection.filters,"nwmsParamsFilter");

            if (nwmsParamsFilter) {
                nwmsParamsFilter.latitudeRangeStart = null;
                nwmsParamsFilter.longitudeRangeStart = null;
                nwmsParamsFilter.latitudeRangeEnd = null;
                nwmsParamsFilter.longitudeRangeEnd = null;
            }

            if (timeSeriesAtPoint) {
                timeSeriesAtPoint.setValue(pointFilterValue);
            }
            else {
                this.dataCollection.filters.push(
                    new Portal.filter.PointFilter({
                        name: 'timeSeriesAtPoint',
                        value: pointFilterValue
                    })
                );
            }
        }
        // disable 'timeSeriesAtPoint' and re-instate the global map constraint
        else {
            var timeSeriesAtPoint = Portal.filter.FilterUtils.getFilter(this.dataCollection.filters,"timeSeriesAtPoint");
            if (timeSeriesAtPoint) {
                timeSeriesAtPoint.setValue(null);

            }
            if (this._getGeometryFilter() != undefined) {
                this.map.events.triggerEvent('spatialconstraintusermodded', this._getGeometryFilter());
            }
        }
    },

    _getGeometryFilter: function() {
        return this.map.geometryFilter;
    },

    _getTimeSeriesFilter: function() {
        return this.pointTimeSeriesCheckbox.checked &&
            this.timeSeriesLatitudeControl.getErrors().length == 0 &&
            this.timeSeriesLongitudeControl.getErrors().length == 0;
    },

    _getTimeSeriesLatitude: function() {
        return this.timeSeriesLatitudeControl.getErrors().length == 0 ?
            this.timeSeriesLatitudeControl.getValue() :
            undefined;
    },

    _getTimeSeriesLongitude: function() {
        return this.timeSeriesLongitudeControl.getErrors().length == 0 ?
            this.timeSeriesLongitudeControl.getValue() :
            undefined;
    }
});


