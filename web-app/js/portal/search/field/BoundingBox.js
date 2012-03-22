Ext.namespace('Portal.search.field');

Portal.search.field.BoundingBox = Ext.extend(Ext.Container, {
   fieldLabel: OpenLayers.i18n('boundingBox'),
   labelSeparator: '',
   layout: 'form',
   
   initComponent: function() { 
      this.items = [
         {
            xtype: 'spacer',
            height: 5
         },{
            xtype: 'container',
            layout: {
               type: 'hbox',
               pack:'center',
               align: 'middle'
            },
            width: 250,
            items: [{
               xtype: 'label',
               text: OpenLayers.i18n('northBL'),
               width: 15
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
               text: OpenLayers.i18n('westBL'),
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
               text: OpenLayers.i18n('eastBL'),
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
               text: OpenLayers.i18n('southBL'),
               width: 15
             },{
               xtype: 'numberfield',
               name: 'southBL',
               ref: '../southBL',
               decimalPrecision: 2,
               width: 50
            }]
         },{
           xtype: 'spacer',
           height: 8
         },{
           xtype: 'label',
           text: OpenLayers.i18n('bboxHint'),
           style: 'font-style: italic'
         },{
           xtype: 'spacer',
           height: 5
         }
      ];

      Portal.search.field.BoundingBox.superclass.initComponent.apply(this, arguments);

      this.mon(this.northBL, 'change', this.onCoordChange, this);
      this.mon(this.southBL, 'change', this.onCoordChange, this);
      this.mon(this.eastBL, 'change', this.onCoordChange, this);
      this.mon(this.westBL, 'change', this.onCoordChange, this);
   },
   
   onCoordChange: function() {
     this.fireEvent('bboxchange', this.getBounds());
   },
   
   getBounds: function() {
     return {
         northBL: this.northBL.getValue(), 
         westBL: this.westBL.getValue(),
         eastBL: this.eastBL.getValue(),
         southBL: this.southBL.getValue()
     };
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

