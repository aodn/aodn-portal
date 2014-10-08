/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.filter');

Portal.filter.ResettableDate = Ext.extend(Ext.Container, {
    ELEMENT_HEIGHT: 25,

    constructor: function(cfg) {
        this._createDateField(cfg);
        this.applyDefaultValueLimits();

        var spacer = new Ext.Spacer({
            width: 10
        });

        this._resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('resetActionText'),
            anchorCls: 'resetText'
        });

        this._resetLink.on('click', function() {
            this.reset();
        }, this);

        var config = Ext.apply({
            layout: 'hbox',
            fieldLabel: cfg.fieldLabel,
            items: [
                this._dateField,
                spacer,
                this._resetLink
            ]
        }, cfg);

        Portal.filter.ResettableDate.superclass.constructor.call(this, config);

        this.addEvents('changed');
    },

    getValue: function() {
        return this._dateField.getValue();
    },

    setValue: function(value) {
        return this._dateField.setValue(value);
    },

    reset: function() {
        var result = this._dateField.reset();
        this.applyDefaultValueLimits();
        this._onChange();
        return result;
    },

    setMinValue: function(value) {
        return this._dateField.setMinValue(value);
    },

    setMaxValue: function(value) {
        return this._dateField.setMaxValue(value);
    },

    applyDefaultValueLimits: function() {
        this.setMinValue(new Date(0));
        this.setMaxValue(new Date());
    },

    hasValue: function() {
        return this._dateField.getValue() != '';
    },

    _createDateField: function(cfg) {
        this._dateField = new Ext.form.DateField({
            name: cfg.name,
            format: OpenLayers.i18n('dateDisplayFormatExtJs'),
            altFormats: OpenLayers.i18n('dateAltFormats'),
            emptyText: cfg.emptyText,
            height: this.ELEMENT_HEIGHT,
            listeners: {
                scope: this,
                select: this._onChange,
                change: this._onChange
            }
        });
    },

    _onChange: function() {
        this.fireEvent('change', this);
    }
});
