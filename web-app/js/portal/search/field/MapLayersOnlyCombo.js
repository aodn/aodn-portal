Ext.namespace('Portal.search.field');

Portal.search.field.MapLayersOnlyCombo = Ext.extend(Ext.form.ComboBox, {
  
  constructor: function(cfg) {
    var config = Ext.apply({
      hideLabel : true,
      name : 'protocolCombo',
      xtype : 'combo',
      anchor: '-2',
      mode : 'local',
      editable : false,
      submitValue : false,
      forceSelection : true,
      triggerAction : 'all',
      
      hiddenName : 'protocol',
      value : '',
      
      store : 
        [
          [ '', 'Show me all results' ],
          [
              Portal.app.config.metadataLayerProtocols.split(
                  "\n").join(' or '),
              'Show me results with map layers only' ]
        ]
    }, cfg);
      
    Portal.search.field.MapLayersOnlyCombo.superclass.constructor.call(this, config);
    
    this.on('select', this.onOptionSelected, this);
  },
  
  getFilterValue: function() {
    return { value: this.getValue() };
  },
  
  setFilterValue: function(v) {
    var value = v.value ? v.value : '';
    this.setValue(value);
  },
  
  onContentChange: function()
  {
    this.fireEvent('protocolChange', this.getValue());
  },
  
  onOptionSelected: function(combo, record, index) {
    this.fireEvent('protocolChange', record.data.field1);
  }
  
});

Ext.reg('portal.search.field.maplayers', Portal.search.field.MapLayersOnlyCombo);
