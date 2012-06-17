Ext.namespace('Portal.search');

Portal.search.FilterSelector = Ext.extend(Ext.Container, {
  
  constructor: function(cfg) {
    this.filterCombo = new Portal.search.filter.FilterComboBox({
      store: cfg.store,
      submitValue: false,
      anchor: '-2'  // prevents combo selector image being cut-off
    });
    
    var config = Ext.apply({
        layout: 'hbox',
        autoHeight: true,
        cls: 'searchField',
        items: [
          {
            xtype: 'spacer',
            flex: 1  // right justify filter combo below
          },
          {
            xtype: 'container',
            autoHeight: true,
            width: 250,
            layout: 'form',  // to get field label
            items: [this.filterCombo]
          }
        ]
      }, cfg);

    Portal.search.FilterSelector.superclass.constructor.call(this, config);
    
    this.relayEvents(this.filterCombo, ['filteradd']);
    
    this.mon(this.store, 'add', this._hideIfNoFilters, this);
    this.mon(this.store, 'remove', this._hideIfNoFilters, this);
  },
  
  _hideIfNoFilters: function() {
	var filtersToAdd = this.store.getCount() > 0;
	
	if (this.rendered) {
		this.setVisible(filtersToAdd);
	} else {
		this.hidden = !filtersToAdd;
  }
  }
  
});
