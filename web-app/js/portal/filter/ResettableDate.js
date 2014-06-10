/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.filter');

Portal.filter.ResettableDate = Ext.extend(Ext.Container, {
    constructor: function(cfg) {
        this._dateField = this._createDateField(cfg);

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
        this._onChange();
        return result; 
    },
    
    setMinValue: function(value) {
        return this._dateField.setMinValue(value);
    },
    
    setMaxValue: function(value) {
        return this._dateField.setMaxValue(value);
    },
    
    hasValue: function() {
        return this._dateField.getValue() != '';
    },
                
    _createDateField: function(cfg) {
        return new Ext.form.DateField({
            name: cfg.name,
            format: "d/m/Y",
            maxValue: new Date(),
            minValue: new Date(0),
            emptyText: cfg.emptyText,
            width: 111,
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
