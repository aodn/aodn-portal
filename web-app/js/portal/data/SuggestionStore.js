Ext.namespace('Portal.data.SuggestionStore');

Portal.data.SuggestionStore = Ext.extend(Ext.data.XmlStore, {
  constructor: function(cfg) {
    var config = Ext.apply({
      autoDestroy: true,
      record: 'value',
      fields: [
        {name: 'value', mapping: '', sortType: Ext.data.SortTypes.asUCString},
        {name: 'count', mapping: '@count'}
      ],
      sortInfo: {
        field: "value",
        direction: 'ASC'
      }
    }, cfg);

    Portal.data.SuggestionStore.superclass.constructor.call(this, config);
    
    this.proxy.conn.disableCaching = false;
  }
});
