
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.field');

Portal.search.field.DateRange = Ext.extend(Ext.Container, {
    layout: 'hbox',

    initComponent: function() {
        this.items = [{
            xtype: 'container',
            layout: 'form',
            width: 190,
            labelWidth: 75,
            margins: { top: 0, right: 15, bottom:0, left: 0 },
            items: [
            {
                fieldLabel: 'Date from',
                labelSeparator: '',
                name: 'extFrom',
                xtype: 'datefield',
                ref: '../fromDate',
                format: 'd/m/Y',
                anchor: '100%',
                maxValue: new Date()
            }
            ]
        },
        {
            xtype: 'container',
            layout: 'form',
            width: 130,
            labelWidth: 20,
            items: [{
                fieldLabel: 'to',
                labelSeparator: '',
                name: 'extTo',
                xtype: 'datefield',
                ref: '../toDate',
                format: 'd/m/Y',
                anchor: '100%',
                maxValue: new Date()
            }]
        }];

        Portal.search.field.DateRange.superclass.initComponent.apply(this, arguments);
    },

    getFilterValue: function() {
        return {
            fromDate: this.fromDate.getValue(),
            toDate: this.toDate.getValue()
        };
    },

    setFilterValue: function(v) {
        this.fromDate.setValue(new Date(v.fromDate));
        this.toDate.setValue(new Date(v.toDate));
    }
});

Ext.reg('portal.search.field.daterange', Portal.search.field.DateRange);

