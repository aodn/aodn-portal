Ext.namespace('Portal.search');

Portal.search.filter.FiltersPanel = Ext.extend(Ext.Panel, {

  flex: 1,            
  defaults : {
    labelSeparator : ''
  },
  autoHeight: true,
  layout: 'form',

  initComponent: function()
  {
    Portal.search.filter.FiltersPanel.superclass.initComponent.apply(this, arguments);

    this.store.each(function (record) {
      this.addFilter(record);
    }, this);

    this.addEvents('contentchange');
    this.enableBubble('contentchange');

    this.mon(this.store, 'add', this.onFilterAdd, this);
    this.mon(this.store, 'remove', this.onFilterRemove, this);
    this.mon(this.store, 'clear', this.onClear, this);
    
    this.on('contentchange', this.handleContentChange, this);
  },

  onFilterAdd: function(store, records)
  {
    Ext.each(records, function(record, index) {
      this.addFilter(record);
    }, this);
  },

  onFilterRemove: function(store, record)
  {
    var filterType = record.get('type');
    var filterComponent = this.find('filterType', filterType)[0]; 
    
    this.remove(filterComponent);

    record.set('asJson', undefined);
  },

  onClear: function()
  {
    this.removeAll();
  },

  addFilter: function(record)
  {
    var filterComponent = Ext.create(record.get('componentConfig'));

    // Set the value if necessary (e.g. if we got here via load saved search).
    if (record.get('filterValue'))
    {
      filterComponent.setFilterValue(record.get('filterValue'));
    }

    // Relay protocol change events (for other filters that are interested in it).
    this.relayEvents(filterComponent, ['protocolChange']);

    if (filterComponent.onProtocolChange)
    {
      filterComponent.mon(this, 'protocolChange', filterComponent.onProtocolChange, filterComponent);
    }

    if (filterComponent.onContentChange)
    {
      filterComponent.mon(this, 'contentChange', filterComponent.onContentChange, filterComponent);
    }

    var actionItem;
    var cls = 'searchField';
    var fixed = record.get('fixed');

    if (!fixed) {
      actionItem = {
          xtype: 'button',
          width: 14,
          iconCls: 'p-remove-filter',
          record: record,
          listeners:{
            scope: this,
            'click': this.removeFieldClick
          }
      };

      // Surround non-fixed components with a grey box (css).
      cls += ' searchFieldSelectors';
    }

    var formField = {
        xtype: 'container',
        layout: 'form',
        labelAlign: this.labelAlign,
        autoHeight: true,
        flex: 1,
        items: filterComponent
    };

    var items;

    if (fixed) {
       items = [formField];  
    } else     if (this.actionSide == 'left') {
      items = [actionItem, {xtype: 'spacer', width: 5}, formField];
    } else {
      items = [formField, {xtype: 'spacer', width: 7}, actionItem];
    }
    
    var newComp = 
      this.add(
          {
            filterType: record.get('type'),
            xtype: 'container',
            layout: 'hbox',
            labelWidth: 75, 
            cls: cls,
            autoHeight: true,
            flex: 1,
            items: items,
            record: record
          });
    
    record.set('filterComponentId', filterComponent.id);
    record.set('asJson', function() {
      return {
        'type' : record.get('type'),
        'value': Ext.getCmp(record.get('filterComponentId')).getFilterValue()
      };
    });

    this.fireEvent('contentchange');

    // TODO: refactor this bounding box specific code out from here.
    // "bounds" should probably not be a property of SearchTabPanel either.
    if (filterComponent.xtype == 'portal.search.field.boundingbox') {
      var bboxField = this.findByType('portal.search.field.boundingbox')[0];

      bboxField.setBox(this.ownerCt.bounds);
      this.relayEvents(bboxField, ['bboxchange']);

      // Need to set value again...
      if (record.get('filterValue'))
      {
        filterComponent.setFilterValue(record.get('filterValue'));
      }
    }
  },

  removeFieldClick: function(btn) 
  {
    var record = btn.record;

    this.store.remove(record);
    this.fireEvent('contentchange');
  },
  
  handleContentChange: function() {
    this.doLayout();
  },
  
  setActionSide: function(actionSide) {
    //TODO: implement
  }
  
});

Ext.reg('portal.search.filter.filterspanel', Portal.search.filter.FiltersPanel);