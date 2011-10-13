Ext.namespace('Portal.search');

Portal.search.ResultsGrid = Ext.extend(Ext.grid.GridPanel, {
   frame: true,
   disableSelection: true,
   autoExpandColumn: 'mdDesc',
   
   initComponent: function() {
     var config = {
         colModel: new Ext.grid.ColumnModel({
           columns: [
               {
                  header: 'Logo', 
                  width: 50,
                  xtype: 'templatecolumn',
                  tpl: '<img class="p-logo" src="'+Portal.app.config.catalogUrl+'/images/logos/{source}.gif"/>',
                  dataIndex: 'source'
               },{
            	   id: 'mdDesc',
                  header: 'Description',
                  width: 650,
                  xtype: 'templatecolumn',
                  tpl: [
                     '<div style="white-space:normal !important;" title="{abstract}">',
                     '<h1>{title}</h1>',
                     '<p>{[values.abstract.substring(0, 350)]}<tpl if="values.abstract.length &gt; 350"> ...</tpl></p>',    // TODO : 350 as parameter
                     '</div>'
                  ],
                  dataIndex: 'title'
               },{
                  header: 'Actions',
                  width: 140,
                  xtype: 'actioncolumn',
                  items: [{
                     iconCls: 'p-result-info',
                     tooltip: 'View metadata',
                     width: 35,
                     height: 35,
                     handler: this.onViewMetadata,
                     scope: this
                  },{
                      getClass: this.getMapGoClass,
                      tooltip: 'Show on mini-map',
                      width: 35,
                      height: 35,
                      handler: this.showOnMiniMapExecute,
                      scope: this
                   },{
                       getClass: this.getMapAddClass,
                       tooltip: 'Add to map',
                       width: 35,
                       height: 35,
                       handler: this.addToMapExecute,
                       scope: this
                    },{
                     iconCls: 'p-result-cart-add',
                     tooltip: 'Add to download cart',
                     width: 35,
                     height: 35,
                     handler: this.addToCartExecute,
                     scope: this
                  }]
               }
           ]
       }),
        bbar: new Ext.PagingToolbar({
           pageSize: 15,
           items: [
               new Ext.Button({
                text: 'Add all',
                tooltip: 'Add all to download cart',
                ctCls: "noBackgroundImage",
                anchor: 'right',
                handler: this.addAllToCartExecute
               }
            )]
        })
     };
 
     //TODO: pull strings out into separate file - i18n style 
    
     Ext.apply(this, Ext.apply(this.initialConfig, config));
 
     Portal.search.ResultsGrid.superclass.initComponent.apply(this, arguments);
     
     // TODO: Remove this HACK when proper paging service used - should bind the store not assign as below 
     this.getBottomToolbar().store = this.store;
     
     this.addEvents('showlayer', 'addlayer', 'rowenter', 'rowleave');
     
  },
  
  afterRender: function(){
      Portal.search.ResultsGrid.superclass.afterRender.call(this);
      
      this.getView().mainBody.on({
          scope    : this,
          mouseover: this.onMouseOver,
          mouseout : this.onMouseOut
      });
  },

  // trigger mouseenter event when applicable
  onMouseOver: function(e, target) {
      var row = this.getView().findRow(target);
      if(row && row !== this.lastRow) {
    	  var rowIndex = this.getView().findRowIndex(row);
          this.fireEvent("mouseenter", this, rowIndex, this.store.getAt(rowIndex), e);
          this.lastRow = row;
      }
  },

  // trigger mouseleave event when applicable
  onMouseOut: function(e, target) {
      if (this.lastRow) {
          if(!e.within(this.lastRow, true, true)){
        	  var lastRowIndex = this.getView().findRowIndex(this.lastRow);
              this.fireEvent("mouseleave", this, lastRowIndex, this.store.getAt(lastRowIndex), e);
              delete this.lastRow;
          }
      }
  },
  
  onViewMetadata: function(grid, rowIndex, colIndex) {
     var rec = this.store.getAt(rowIndex);
     var viewmetadata = Portal.app.config.catalogUrl + '/srv/en/metadata.show\?uuid\='+rec.get('uuid');
     
     window.open(viewmetadata,'_blank','width=1000,height=800,toolbar=yes,resizable=yes');
  },
  
  getMapGoClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.hasProtocol(rec.get('links'), ['OGC:WMS-1.1.1-http-get-map', 'OGC:WMS-1.3.0-http-get-map'])) {
		  return 'p-result-map-go';
	  } else {
		  return 'p-result-disabled';
	  };
  },
 
  getMapAddClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.hasProtocol(rec.get('links'), ['OGC:WMS-1.1.1-http-get-map', 'OGC:WMS-1.3.0-http-get-map'])) {
		  return 'p-result-map-add';
	  } else {
		  return 'p-result-disabled';
	  };
  },
 
  showOnMiniMapExecute: function(grid, rowIndex, colIndex) {
     var rec = this.store.getAt(rowIndex);
     var links = rec.get('links');
     var linkStore = new Portal.search.data.LinkStore({
    	data: {links: links} 
     });
     linkStore.filter('protocol', /OGC:WMS-.*http-get-map/, true);
     if (linkStore.getCount()==1) { 
    	 this.fireEvent('showlayer', this.getRecord(linkStore.getAt(0)));
     } else {
    	 Ext.Msg.alert('Multiple layers - not yet implemented');
     };
  },
  
  addToMapExecute: function(grid, rowIndex, colIndex) {
	 Ext.Msg.alert('Not yet implemented');
  },
  
  hasProtocol: function(links, values) {
	 for (var i=0; i<links.length; i++) {
		for (var j=0; j<values.length; j++) {
			if (links[i].protocol==values[j]) {
				return true;
			};
	 	};
	 };
	 
	 return false;
  },
  
  getRecord: function(rec) {
	  return {
         server: rec.get('url'),
         layer: rec.get('name'),
         protocol: rec.get('protocol'),
         title: rec.get('title')
	  };
  },
  
  addToCartExecute: function(grid, rowIndex, colIndex) {
     Ext.Msg.alert('Add to cart\ngrid: ' + grid + '\nrowIndex: ' + rowIndex + '\ncolIndex: ' + colIndex);
  },
  
  addAllToCartExecute: function(grid, rowIndex, colIndex) {
     Ext.Msg.alert('Add all to cart\ngrid: ' + grid + '\nrowIndex: ' + rowIndex + '\ncolIndex: ' + colIndex);
  } 
});

Ext.reg('portal.search.resultsgrid', Portal.search.ResultsGrid);
