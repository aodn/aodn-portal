Ext.namespace('Portal.search.field');

Portal.search.field.FacetedDateRange = Ext.extend(Ext.Container, {
    layout:'auto',

    initComponent:function () {
        this.items = [
            {
                xtype: 'container',
                layout: 'form',
                width: 130,
                labelWidth: 25,
                margins: {top:5, right:15, bottom:0, left:20},
                items: [
                    {
                        fieldLabel: 'From',
                        labelSeparator: '',
                        name: 'extFrom',
                        xtype: 'datefield',
                        ref: '../fromDate',
                        format: OpenLayers.i18n('dateDisplayFormatExtJs'),
                        altFormats: OpenLayers.i18n('dateAltFormats'),
                        anchor: '100%',
                        minValue: new Date(0),
                        maxValue: new Date(),
                        listeners: {
                            scope: this,
                            invalid: this._onUpdate,
                            valid: this._onUpdate
                        }
                    }
                ]
            },

            {
                xtype: 'container',
                layout: 'form',
                width: 130,
                labelWidth: 25,
                items: [
                    {
                        fieldLabel: 'To',
                        labelSeparator: '',
                        name: 'extTo',
                        xtype: 'datefield',
                        ref: '../toDate',
                        format: OpenLayers.i18n('dateDisplayFormatExtJs'),
                        altFormats: OpenLayers.i18n('dateAltFormats'),
                        anchor: '100%',
                        minValue: new Date(0),
                        maxValue: new Date(),
                        listeners: {
                            scope: this,
                            invalid: this._onUpdate,
                            valid: this._onUpdate
                        }
                    }
                ]
            }
        ];

        Portal.search.field.FacetedDateRange.superclass.initComponent.apply(this, arguments);
    },

    getFilterValue:function () {
        return {
            fromDate:this.fromDate.getValue(),
            toDate:this.toDate.getValue()
        };
    },

    setFilterValue:function (v) {
        this.fromDate.setValue(new Date(v.fromDate));
        this.fromDate.setMaxValue(this.toDate.getValue());
        this.toDate.setValue(new Date(v.toDate));
        this.toDate.setMinValue(this.fromDate.getValue());
    },

    clearValues:function () {
        this.fromDate.reset();
        this.toDate.reset();
        this.toDate.setMinValue(new Date(0));
        this.fromDate.setMaxValue(new Date());
    },

    isValid:function () {
        return this.fromDate.getActiveError() == ''
            && this.fromDate.getValue() != ''
            && this.toDate.getActiveError() == ''
            && this.toDate.getValue() != '';
    },

    _onUpdate:function () {
        this._setMinMax();

        if (this.isValid()) {
            this.fireEvent('valid');
        } else {
            this.fireEvent('invalid');
        }
    },

    _setMinMax: function () {
        if (Ext.isDefined(this._updatingMinMax)) {
            return;
        }

        this._updatingMinMax = true;

        this.toDate.setMinValue(this.fromDate.getValue());
        this.toDate.validate();
        this.fromDate.setMaxValue(this.toDate.getValue());
        this.fromDate.validate();

        delete this._updatingMinMax;

    }
});

Ext.reg('portal.search.field.faceteddaterange', Portal.search.field.FacetedDateRange);

