/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
                        format: 'd/m/Y',
                        anchor: '100%',
                        minValue: new Date(0),
                        maxValue: new Date(),
                        listeners: {
                            scope: this,
                            select: this.onSelect,
                            change: this.onSelect
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
                        format: 'd/m/Y',
                        anchor: '100%',
                        minValue: new Date(0),
                        maxValue: new Date(),
                        listeners: {
                            scope: this,
                            select: this.onSelect,
                            change: this.onSelect
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
        this.toDate.setValue(new Date(v.toDate));
    },

    clearValues:function () {
        this.fromDate.reset();
        this.toDate.reset();
        this.toDate.setMinValue(new Date(0));
    },

    onSelect:function () {
        this.toDate.setMinValue(this.fromDate.getValue());
    }
});

Ext.reg('portal.search.field.faceteddaterange', Portal.search.field.FacetedDateRange);

