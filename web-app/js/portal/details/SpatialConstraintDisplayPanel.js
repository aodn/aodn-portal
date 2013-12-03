/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SpatialConstraintDisplayPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {

        this.boxDisplayPanel = new Portal.details.BoxDisplayPanel(cfg);
        this.polygonDisplayPanel = new Portal.details.PolygonDisplayPanel({
            height: 90
        });

        var config = Ext.apply({
            layout: new Ext.layout.CardLayout(),
            title: String.format("<b>{0}</b>", OpenLayers.i18n('spatialExtentHeading')),
            activeItem: this.boxDisplayPanel,
            items: [
                this.boxDisplayPanel,
                this.polygonDisplayPanel
            ]
        }, cfg);

        Portal.details.SpatialConstraintDisplayPanel.superclass.constructor.call(this, config);

        var self = this;
        if (config.map) {
            config.map.events.addEventType('spatialconstraintadded');

            config.map.events.on({
                scope: config.map,
                'spatialconstraintadded': function(geometry) {
                    var card = geometry.isBox() ? self.boxDisplayPanel : self.polygonDisplayPanel;
                    self._showCard(card, geometry);
                }
            });
        }
    },

    _showCard: function(card, geometry) {

        // Ext gets a bit upset trying to set active item on a yet-to-be rendered container.
        if (this.rendered) {
            this.layout.setActiveItem(card);
            this.layout.activeItem.setGeometry(geometry);
        }
   },

    setBounds: function(bounds) {
        this.boxDisplayPanel.setBounds(bounds);
    },

    getSouthBL: function() {
        return this._getBoundingLine(this.boxDisplayPanel.southBL);
    },

    getNorthBL: function() {
        return this._getBoundingLine(this.boxDisplayPanel.northBL);
    },

    getEastBL: function() {
        return this._getBoundingLine(this.boxDisplayPanel.eastBL);
    },

    getWestBL: function() {
        return this._getBoundingLine(this.boxDisplayPanel.westBL);
    },

    _getBoundingLine: function(field) {
        return parseFloat(field.value);
    },

    _buildBoundingBox: function(config) {
        this.northBL = this._buildCoord('northBL');
        this.eastBL = this._buildCoord('eastBL');
        this.southBL = this._buildCoord('southBL');
        this.westBL = this._buildCoord('westBL');

        return [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack:'center',
                    align: 'middle'
                },
                width: this.width,
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
                width: config.width,
                items: [
                    this._buildLabel('westBL'),
                    this.westBL,
                    {
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    },
                    this.eastBL,
                    {xtype: 'spacer', width: 5},
                    this._buildLabel('eastBL')
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                width: config.width,
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

    _buildCoord: function(name) {
        return new Ext.form.NumberField({
            name: name,
            decimalPrecision: 2,
            width: 50,
            disabled: true
        });
    }

});
