Ext.namespace('Portal.search');

Portal.search.filter.FiltersPanel = Ext.extend(Ext.Panel, {
	
	flex: 1,            
	defaults : {
		width : 525,
		labelSeparator : ''
	},
	width : 545,
    autoHeight: true,
    layout: 'form',
	
	initComponent: function()
	{
		Portal.search.filter.FiltersPanel.superclass.initComponent.apply(this, arguments);
		
		this.store.each(function (record) {
			this.addFilter(record);
		}, this);
		
		this.addEvents('contentchange', 'filterremove');
		this.enableBubble('contentchange');
		
		this.mon(this.store, 'add', this.onFilterAdd, this);
		this.mon(this.store, 'remove', this.onFilterRemove, this);
		this.mon(this.store, 'clear', this.onClear, this);
	},
	
	onFilterAdd: function(store, records)
	{
		Ext.each(records, function(record, index) {
			this.addFilter(record);
		}, this);
	},
	
	onFilterRemove: function(store, record)
	{
		this.remove(record.get('displayedComponentId'));
		
		record.set('displayedComponentId', undefined);
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
        if (record.filterValue)
        {
        	filterComponent.setFilterValue(record.filterValue);
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
        
		var items = 
		[
		 	{
		 		xtype: 'container',
		 		layout: 'form',
		 		autoHeight: true,
		 		width: 450,
		 		items: filterComponent
		 	}
		];
		
		var cls = '';
		if (!record.get('fixed'))
		{
			// Include a "remove" button if the filter is not a fixed filter.
	        items.push(
			{
		            ref: 'removeField',
		            xtype: 'button',
		            text: 'Remove',
		            record: record,
		            listeners:{
		               scope: this,
		               'click': this.removeFieldClick
		            }
			});

	        // Surround non-fixed components with a grey box (css).
	        cls = 'searchFieldSelectors';
		}

		var newComp = 
			this.add(
			{
	           xtype: 'container',
	           layout: 'hbox',
	           labelWidth: 75, 
	           padding: '10px 0px 20px 0px',
	           cls: cls,
	           autoHeight: true,
	           items: items,
	           record: record
	        });
		
		record.set('displayedComponentId', newComp.getId());

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
          if (record.filterValue)
          {
        	  filterComponent.setFilterValue(record.filterValue);
          }
        }
	},
	
    removeFieldClick: function(btn) 
    {
    	var record = btn.record;

    	this.store.remove(record);
    	this.fireEvent('filterremove', record);
        this.fireEvent('contentchange');
    }
});

Ext.reg('portal.search.filter.filterspanel', Portal.search.filter.FiltersPanel);