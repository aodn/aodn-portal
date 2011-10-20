Ext.namespace('Portal.search');

Portal.search.ResultsGrid = Ext.extend(Ext.grid.GridPanel, {
   frame: true,
   disableSelection: true,
   autoExpandColumn: 'mdDesc',
   LAYER_PROTOCOLS: ['OGC:WMS-1.1.1-http-get-map', 'OGC:WMS-1.3.0-http-get-map'],
   LAYER_REGEXP: /OGC:WMS-.*http-get-map/,
   DOWNLOADABLE_PROTOCOLS: ['WWW:DOWNLOAD-1.0-http--download', 'WWW:LINK-1.0-http--link'],
   
   initComponent: function() {
     var config = {
        colModel: new Ext.grid.ColumnModel({
           columns: [
               {
                  header: OpenLayers.i18n('logoHeading'), 
                  width: 50,
                  xtype: 'templatecolumn',
                  tpl: '<img class="p-logo" src="'+Portal.app.config.catalogUrl+'/images/logos/{source}.gif"/>',
                  dataIndex: 'source'
               },{
            	   id: 'mdDesc',
                  header: OpenLayers.i18n('descHeading'),
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
                  header: OpenLayers.i18n('actionsHeading'),
                  width: 140,
                  xtype: 'actioncolumn',
                  items: [{
                     iconCls: 'p-result-info',
                     tooltip: OpenLayers.i18n('datasetInfo'),
                     width: 35,
                     height: 35,
                     handler: this.onViewMetadata,
                     scope: this
                  },{
                      getClass: this.getMapGoClass,
                      tooltip: OpenLayers.i18n('showOnMinimap'),
                      width: 35,
                      height: 35,
                      handler: this.showOnMiniMapExecute,
                      scope: this
                   },{
                       getClass: this.getMapAddClass,
                       tooltip: OpenLayers.i18n('addToMap'),
                       width: 35,
                       height: 35,
                       handler: this.addToMapExecute,
                       scope: this
                    },{
                        getClass: this.getLayerSelectClass,
                        tooltip: OpenLayers.i18n('selectLayer'),
                        width: 35,
                        height: 35,
                        handler: this.selectLayerExecute,
                        scope: this
                     },{
                     getClass: this.getAddToDownloadClass,
                     tooltip: OpenLayers.i18n('ttAddToDownload'),
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
                text: OpenLayers.i18n('btnAddAllToDownload'),
                tooltip: OpenLayers.i18n('ttAddAllToDownload'),
                ctCls: "noBackgroundImage",
                anchor: 'right',
                handler: this.addAllToCartExecute,
                scope: this
               }),
               new Ext.Button({
                text: OpenLayers.i18n('btnClearDownload'),
                tooltip: OpenLayers.i18n('ttClearDownload'),
                ctCls: "noBackgroundImage",
                anchor: 'right',
                handler: this.clearCartExecute,
                scope: this
               })
            ]
        })
     };
 
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

  // trigger mouseenter event on row when applicable
  onMouseOver: function(e, target) {
      var row = this.getView().findRow(target);
      if(row && row !== this.lastRow) {
    	  var rowIndex = this.getView().findRowIndex(row);
          this.fireEvent("mouseenter", this, rowIndex, this.store.getAt(rowIndex), e);
          this.lastRow = row;
      }
  },

  // trigger mouseleave event on row when applicable
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
	  if (this.getProtocolCount(rec.get('links'), this.LAYER_PROTOCOLS) == 1) {
		  return 'p-result-map-go';
	  } else {
		  return 'p-result-disabled';
	  };
  },
 
  getMapAddClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.getProtocolCount(rec.get('links'), this.LAYER_PROTOCOLS) == 1) {
		  return 'p-result-map-add';
	  } else {
		  return 'p-result-disabled';
	  };
  },
 
  getLayerSelectClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.getProtocolCount(rec.get('links'), this.LAYER_PROTOCOLS) > 1) {
		  return 'p-result-select-layer';
	  } else {
		  return 'p-result-disabled';
	  };
  },

  getAddToDownloadClass: function(v, metadata, rec, rowIndex, colIndex, store) {
      if (this.getProtocolCount(rec.get('links'), this.DOWNLOADABLE_PROTOCOLS) > 0) {
              return 'p-result-cart-add';
      } else {
              return 'p-result-disabled';
      };
  },

  showOnMiniMapExecute: function(grid, rowIndex, colIndex) {
   	 this.fireEvent('showlayer', this.getLayerLink(rowIndex));
  },
  
  selectLayerExecute: function(grid, rowIndex, colIndex) {
     var rec = this.store.getAt(rowIndex);
     var links = rec.get('links');
     var linkStore = new Portal.search.data.LinkStore({
    	data: {links: links} 
     });
	    linkStore.filter('protocol', this.LAYER_REGEXP, true);
	     
    	 if (!this.layerSelectionWindow ) {
	    	 this.layerSelectionWindow = this.buildLayerSelectionWindow(linkStore);
     } else {
    		 this.layerSelectionWindow.bindStore(linkStore);
    	 };
    	 
    	 this.layerSelectionWindow.show();
	  },
	  
	buildLayerSelectionWindow: function(linkStore) {
		return new Portal.search.LayerSelectionWindow({
	    		store: linkStore,
	    		listeners: {
	    			scope: this,
	    			destroy: function() {
	 				delete this.layerSelectionWindow;
	    			},
	 			showlayer: function(layerLink) {
	 				this.fireEvent('showlayer', layerLink);
	 			},
	 			addlayer: function(layerLink) {
	 				this.fireEvent('addlayer', layerLink);
	    			}
	    		}
	    	 });
  },
  
  addToMapExecute: function(grid, rowIndex, colIndex) {
 	 this.fireEvent('addlayer', this.getLayerLink(rowIndex));
  },
  
  getProtocolCount: function(links, values) {
	 var count = 0;
	 for (var i=0; i<links.length; i++) {
		for (var j=0; j<values.length; j++) {
			if (links[i].protocol==values[j]) {
				count++;
			};
	 	};
	 };
	 
	 return count;
  },
    
  containsProtocol: function(protocolArray, protocolName) {
	 
         for (var i=0; i < protocolArray.length; i++) {

            if (protocolArray[i] == protocolName) {
                return true;
            }
	 }
	 
	 return false;
  },
  
  addLinkDataToCart: function(rec, cart) {
      
    var links = rec.get('links');

    for (var i = 0; i < links.length; i++) {

        var link = links[i];

        var linkData = {title: link.title,
                        type: link.type,
                        href: link.href,
                        protocol: link.protocol};

        if ( this.containsProtocol( this.DOWNLOADABLE_PROTOCOLS, linkData.protocol ) ) {
            cart.push( linkData );
        }
    }
  },
  
  getLayerLink: function(rowIndex) {
     var rec = this.store.getAt(rowIndex);
     var links = rec.get('links');
     var linkStore = new Portal.search.data.LinkStore({
    	data: {links: links} 
     });
     linkStore.filter('protocol', this.LAYER_REGEXP, true);
	  
     return linkStore.getLink(0);
  },
  
 addToCartExecute: function(grid, rowIndex, colIndex) {
          
     var workingCart = this.getDownloadCart();
     
     var msg = 'Add to cart: item @ rowIndex ' + rowIndex;
     msg += '<br>Cart had ' + workingCart.length + ' item(s)';     
     
     var rec = grid.store.getAt(rowIndex)
     
     this.addLinkDataToCart(rec, workingCart);
     
     msg += '<br>Cart now has ' + workingCart.length + ' item(s)';
     
     this.setDownloadCart(workingCart);
     
     Ext.Msg.alert('Add to cart', msg);
  },
  
  addAllToCartExecute: function() { // button, event
      
        var msg = 'Add all to cart';
        
        var workingCart = this.getDownloadCart();

        msg += '<br>Cart had ' + workingCart.length + ' item(s)';

        this.getStore().each(function(rec){
            
            this.addLinkDataToCart(rec, workingCart);
        }, this);

        this.setDownloadCart( workingCart );

        msg += '<br>Cart now has ' + workingCart.length + ' item(s)';

        Ext.Msg.alert( 'Add all to cart', msg );
    },
    
    clearCartExecute: function() {
        
        var workingCart = this.getDownloadCart();

        var msg = 'Cart cleared of ' + workingCart.length + ' item(s)'

        this.setDownloadCart( [] );

        Ext.Msg.alert( 'Clear cart', msg );
    },
    
    getDownloadCart: function() {
        var encStateValue = Ext.state.Manager.get( "AggregationItems" );
        
        if (encStateValue == undefined) {
            return [];
        }
        else {
            return Ext.decode( encStateValue );
        }        
    },
    
    setDownloadCart: function(newCart) {
        var encStateValue = Ext.encode( newCart );
        
        Ext.state.Manager.set( "AggregationItems", encStateValue );
    }
});

Ext.reg('portal.search.resultsgrid', Portal.search.ResultsGrid);