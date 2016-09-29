Ext.namespace('Portal.filter.ui');

Portal.filter.ui.ResettableDate = Ext.extend(Ext.Container, {
    ELEMENT_HEIGHT: 25,
    ELEMENT_WIDTH: 110,

    constructor: function(cfg) {
        this._createDateField(cfg);
        this.applyDefaultValueLimits();

        var spacer = new Ext.Spacer({
            width: 10
        });

        this._resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('resetLabel')}),
            iconCls: 'small resetText'
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

        Portal.filter.ui.ResettableDate.superclass.constructor.call(this, config);

        this.addEvents('changed');
    },

    getValue: function() {

        var value = this._dateField.getUtcValue();
        return value == '' ? null : value;
    },

    setValue: function(value) {
        return this._dateField.setUtcValue(value);
    },

    reset: function() {
        var result = this._dateField.reset();
        this.applyDefaultValueLimits();
        this._onChange();
        return result;
    },

    setMinimumValue: function(value) {
        this._dateField.setMinUtcValue(value ? value : Portal.utils.Date.getEarliestPortalDate());
    },

    setMaximumValue: function(value) {
        this._dateField.setMaxUtcValue(value ? value : Portal.utils.Date.getLatestPortalDate());
    },

    isDateValid: function() {
        return this._dateField.validate();
    },

    applyDefaultValueLimits: function() {
        this.setMinimumValue();
        this.setMaximumValue();
    },

    _createDateField: function(cfg) {
        this._dateField = new Portal.form.UtcDateField({
            name: cfg.name,
            format: OpenLayers.i18n('dateDisplayFormatExtJs'),
            altFormats: OpenLayers.i18n('dateAltFormats'),
            emptyText: cfg.emptyText,
            blankText: OpenLayers.i18n('emptyDateFieldMessage'),
            allowBlank: true,
            height: this.ELEMENT_HEIGHT,
            width: this.ELEMENT_WIDTH,
            listeners: {
                scope: this,
                select: this._onChange,
                change: this._onChange
            }
        });
    },

    _onChange: function() {
        if (this._getValueAsTime() != this._previousTime) {
            this.fireEvent('change', this);
            this._previousTime = this._getValueAsTime();
        }
    },

    _getValueAsTime: function() {
        return this.getValue() ? this.getValue().getTime() : null;
    }
});
