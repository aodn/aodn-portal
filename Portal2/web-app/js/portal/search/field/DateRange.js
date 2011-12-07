Ext.namespace('Portal.search.field');

Portal.search.field.DateRange = Ext.extend(Ext.Container, {
   layout: 'hbox',
   
   initComponent: function() { 
      this.items = [
         {
            xtype: 'container',
            layout: 'form',
            width: 235,
            labelWidth: 125,
            margins: {top: 0, right: 15, bottom:0, left: 0},
            items: [
               {
                  fieldLabel: 'Date from',
                  name: 'extFrom',
                  xtype: 'datefield',
                  format: 'd/m/Y',
                  anchor: '100%'
               }
            ]
         },{
            xtype: 'container',
            layout: 'form',
            width: 130,
            labelWidth: 20,
            items: [
               {
                  fieldLabel: 'to',
                  name: 'extTo',
                  xtype: 'datefield',
                  format: 'd/m/Y',
                  anchor: '100%'
               }
            ]
         }
      ];

      Portal.search.field.DateRange.superclass.initComponent.apply(this, arguments);
   }
});

Ext.reg('portal.search.field.daterange', Portal.search.field.DateRange);

