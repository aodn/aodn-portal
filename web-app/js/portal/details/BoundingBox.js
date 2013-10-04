/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.BoundingBox = Ext.extend(Ext.Container, {
    constructor: function(cfg) {
        var defaults = {
            width: 170
        }

        var config = Ext.apply({}, cfg, defaults);

        config.items = this._buildBoundingBox(config);

        Portal.details.BoundingBox.superclass.constructor.call(this, config);
    },

    setBounds: function(bounds) {
        this.southBL.setValue(bounds.bottom);
        this.westBL.setValue(bounds.left);
        this.northBL.setValue(bounds.top);
        this.eastBL.setValue(bounds.right);
    },

    getSouthBL: function() {
        return parseFloat(this.southBL.value);
    },

    getNorthBL: function() {
        return parseFloat(this.northBL.value);
    },

    getEastBL: function() {
        return parseFloat(this.eastBL.value);
    },

    getWestBL: function() {
        return parseFloat(this.westBL.value);
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
           },{
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
           },{
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
