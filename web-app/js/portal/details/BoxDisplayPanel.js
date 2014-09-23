/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.BoxDisplayPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {

        this.tableWidth = 165;
        this.map= cfg.map;


        var config = Ext.apply({
            cls: "bboxExtentPicker",
            items: [
                this._buildBoundingBox(cfg)
            ],
            padding: '0 0 0 20px'
        }, cfg);

        Portal.details.BoxDisplayPanel.superclass.constructor.call(this, config);
    },

    setGeometry: function(geometry) {
        // Defer this incase this is not rendered yet.
        var self = this;
        setTimeout(function() {
            self.setBounds(geometry.getBounds());
        }, 0);
    },

    setGeometryFromUserEnteredVals: function() {

        if (this.map) {
            var newBoundsAsGeometry = this.getBounds().toGeometry();
            if (newBoundsAsGeometry.getArea() >= 0) {
                this.map.events.triggerEvent('spatialconstraintuseradded', newBoundsAsGeometry);
            }
        }
    },

    getBounds: function() {
        return new OpenLayers.Bounds(
            this.westBL.getValue(),
            this.southBL.getValue(),
            this.eastBL.getValue(),
            this.northBL.getValue()
        );
    },

    setBounds: function(bounds) {
        this.southBL.setValue(bounds.bottom);
        this.westBL.setValue(bounds.left);
        this.northBL.setValue(bounds.top);
        this.eastBL.setValue(bounds.right);
    },

    _buildBoundingBox: function(config) {
        this.northBL = this._buildCoord('northBL',-90,90);
        this.eastBL = this._buildCoord('eastBL',-180,180);
        this.southBL = this._buildCoord('southBL',-90,90);
        this.westBL = this._buildCoord('westBL',-180,180);

        return [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack:'center',
                    align: 'middle'
                },
                width: this.tableWidth,
                items: [
                    this._buildLabel('northBL'),
                    this.northBL
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                width: this.tableWidth,
                items: [
                    this._buildLabel('westBL'),
                    this.westBL,
                    {
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    },
                    this._buildLabel('eastBL'),
                    this.eastBL,
                    {
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                width: this.tableWidth,
                items: [
                    this._buildLabel('southBL'),
                    this.southBL
                ]
            }
        ];
    },

    _buildLabel: function(i18nKey) {
        return new Ext.form.Label({
            text: OpenLayers.i18n(i18nKey),
            width: 15
        });
    },

    hasNumberFieldErrors: function() {

        var errors = [].concat(
            this.southBL.getErrors(),
            this.westBL.getErrors(),
            this.northBL.getErrors(),
            this.eastBL.getErrors());
        return (errors.length == 0);
    },

    _buildCoord: function(name, min, max) {
        return new Ext.form.NumberField({
            name: name,
            decimalPrecision: 2,
            width: 55,
            minValue : min,
            maxValue : max,
            listeners: {
                scope: this,
                change: function(numberField) {
                    if (this.hasNumberFieldErrors()) {
                        this.setGeometryFromUserEnteredVals();
                    }
                }
            }
        });
    }
});
