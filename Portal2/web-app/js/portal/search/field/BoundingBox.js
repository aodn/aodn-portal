Ext.namespace('Portal.search.field');

Portal.search.field.BoundingBox = Ext.extend(Ext.Container, {
   fieldLabel: 'Bounding Box',
   layout: 'form',
   
   initComponent: function() { 
      this.items = [
         {
            xtype: 'container',
            layout: {
               type: 'hbox',
               pack:'center',
               align: 'middle'
            },
            width: 250,
            items: [{
               xtype: 'label',
               text: 'N',
               width: 15,
             },{
               xtype: 'numberfield',
               ref: '../northBL',
               name: 'northBL',
               decimalPrecision: 2,
               width: 50
            }]
         },{
            xtype: 'container',
            layout: {
               type: 'hbox',
               align: 'middle'
            },
            width: 250,
            items: [
               {
               xtype: 'label',
               text: 'W',
               width: 15
             },{
               xtype: 'numberfield',
               name: 'westBL',
               ref: '../westBL',
               decimalPrecision: 2,
               width: 50
            },{
               xtype: 'label',
               text: ' ',
               flex: 1
             },{
               xtype: 'numberfield',
               name: 'eastBL',
               ref: '../eastBL',
               decimalPrecision: 2,
               width: 50
            },{
               xtype: 'label',
               text: 'E',
               margins: '0 0 0 5',
               width: 15
             }
            ]
         },{
            xtype: 'container',
            layout: {
               type: 'hbox',
               pack: 'center',
               align: 'middle'
            },
            width: 250,
            items: [{
               xtype: 'label',
               text: 'S',
               width: 15
             },{
               xtype: 'numberfield',
               name: 'southBL',
               ref: '../southBL',
               decimalPrecision: 2,
               width: 50
            }]
         }
      ];

      Portal.search.field.BoundingBox.superclass.initComponent.apply(this, arguments);
   },
   
   setBox: function(boundingBox) {
      if (boundingBox.northBL) {
         this.northBL.setValue(boundingBox.northBL);
      };
      if (boundingBox.westBL) {
         this.westBL.setValue(boundingBox.westBL);
      };
      if (boundingBox.eastBL) {
         this.eastBL.setValue(boundingBox.eastBL);
      };
      if (boundingBox.southBL) {
         this.southBL.setValue(boundingBox.southBL);
      };
   }
   
   
});

Ext.reg('portal.search.field.boundingbox', Portal.search.field.BoundingBox);

