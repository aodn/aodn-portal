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
                  width: 150,
                  xtype: 'portal.common.actioncolumn',
                  items: [{
                     iconCls: 'p-result-info',
                     tooltip: OpenLayers.i18n('datasetInfo'),
                     width: 35,
                     height: 35,
                     handler: this.onViewMetadata,
                     scope: this
                  },{
                      getClass: this.getMapGoClass,
                      getTooltip: this.getMapGoTooltip,
                      width: 35,
                      height: 35,
                      handler: this.showOnMiniMapExecute,
                      scope: this
                   },{
                       getClass: this.getMapAddClass,
                       getTooltip: this.getAddMapTooltip,
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
                     },{
                       getClass: this.getShowLinkClass,
                       getTooltip: this.getShowLinkTooltip,
                       width: 35,
                       height: 35,
                       handler: this.showLink,
                       scope: this
                    },{
                      getClass: this.getSelectLinkClass,
                      tooltip: OpenLayers.i18n('selectLink'),
                      width: 35,
                      height: 35,
                      handler: this.selectLink,
                      scope: this
                   }]
               }
           ]
       }),
        bbar: new Ext.PagingToolbar({
           pageSize: 15,
           items: [
               {xtype: 'tbseparator'}, // Separator
               new Ext.Button({
                text: OpenLayers.i18n('btnAddAllToDownload'),
                tooltip: OpenLayers.i18n('ttAddAllToDownload'),
                cls: "x-btn-text-icon",
                icon: "images/basket_add.png",
                anchor: 'right',
                handler: this.addAllToCartExecute,
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
  onMouseOver : function(e, target) {
    var row = this.getView().findRow(target);
    if (row && row !== this.lastRow) {
      var rowIndex = this.getView().findRowIndex(row);
      this.fireEvent("mouseenter", this, rowIndex, this.store
          .getAt(rowIndex), e);
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
    var viewMetadataUrl = Portal.app.config.catalogUrl + '/srv/en/metadata.show\?uuid\='+rec.get('uuid');

    Portal.common.BrowserWindow.open(viewMetadataUrl);
  },
  
  getMapGoClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.getProtocolCount(rec.get('links'), Portal.app.config.metadataLayerProtocols) == 1) {
		  return 'p-result-map-go';
	  } else {
		  return 'p-result-disabled';
	  };
  },
 
  getMapGoTooltip: function(v, metadata, rec, rowIndex, colIndex, store) {
    var linkRec = this.getLinkRec(rowIndex, Portal.app.config.metadataLayerProtocols);
    if (!linkRec) return '';
    var layerDesc = linkRec.get('title');
    return OpenLayers.i18n('showOnMinimap', {layerDesc: layerDesc});
  },

  getMapAddClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.getProtocolCount(rec.get('links'), Portal.app.config.metadataLayerProtocols) == 1) {
		  return 'p-result-map-add';
	  } else {
		  return 'p-result-disabled';
	  };
  },

  getAddMapTooltip: function(v, metadata, rec, rowIndex, colIndex, store) {
    var linkRec = this.getLinkRec(rowIndex, Portal.app.config.metadataLayerProtocols);
    if (!linkRec) return '';
    var layerDesc = linkRec.get('title');
    return OpenLayers.i18n('addToMap', {layerDesc: layerDesc});
  },

  getShowLinkClass: function(v, metadata, rec, rowIndex, colIndex, store) {
    if (this.getProtocolCount(rec.get('links'), Portal.app.config.metadataLinkProtocols) == 1) {
      return 'p-result-show-link';
    } else {
      return 'p-result-disabled';
    };
  },
 
  getShowLinkTooltip: function(v, metadata, rec, rowIndex, colIndex, store) {
    var linkRec = this.getLinkRec(rowIndex, Portal.app.config.metadataLinkProtocols);
    if (!linkRec) return '';
    var linkDesc = linkRec.get('title');
    if (linkDesc.trim() == '') linkDesc = linkRec.get('name');
    return linkDesc;
  },

  getSelectLinkClass: function(v, metadata, rec, rowIndex, colIndex, store) {
    if (this.getProtocolCount(rec.get('links'), Portal.app.config.metadataLinkProtocols) > 1) {
      return 'p-result-select-link';
    } else {
      return 'p-result-disabled';
    };
  },
 
  getLayerSelectClass: function(v, metadata, rec, rowIndex, colIndex, store) {
	  if (this.getProtocolCount(rec.get('links'), Portal.app.config.metadataLayerProtocols) > 1) {
		  return 'p-result-select-layer';
	  } else {
		  return 'p-result-disabled';
	  };
  },

  getAddToDownloadClass: function(v, metadata, rec, rowIndex, colIndex, store) {
      
      var downloadableProtocols = Portal.app.config.downloadCartDownloadableProtocols.split("\n");
      
      if (this.getProtocolCount(rec.get('links'), downloadableProtocols) > 0) {
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
    linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);

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
  
  showLink: function(grid, rowIndex, colIndex) {
    var linkRec = this.getLinkRec(rowIndex, Portal.app.config.metadataLinkProtocols);
    Portal.common.BrowserWindow.open(linkRec.get('url'));
  },
    
  selectLink: function(grid, rowIndex, colIndex) {
    var rec = this.store.getAt(rowIndex);
    var links = rec.get('links');
    var linkStore = new Portal.search.data.LinkStore({
      data: {links: links} 
    });

    linkStore.filterByProtocols(Portal.app.config.metadataLinkProtocols);

    if (!this.linkSelectionWindow ) {
      this.linkSelectionWindow = this.buildLinkSelectionWindow(linkStore);
    } else {
      this.linkSelectionWindow.bindStore(linkStore);
    };

    this.linkSelectionWindow.show();
  },
    
  buildLinkSelectionWindow: function(linkStore) {
    return new Portal.search.LinkSelectionWindow({
      store: linkStore,
      listeners: {
        scope: this,
        destroy: function() {
          delete this.linkSelectionWindow;
        }
      }
    });
  },
  
  addToMapExecute: function(grid, rowIndex, colIndex) {
 	 this.fireEvent('addlayer', this.getLayerLink(rowIndex));
  },
  
  getProtocolCount: function(links, values) {
    var protocols = Ext.isString(values)?values.split('\n'):values;
    var count = 0;

    for (var i=0; i<links.length; i++) {
      for (var j=0; j<protocols.length; j++) {
        if (links[i].protocol==protocols[j].trim()) {
          count++;
        };
      };
    };

    return count;
  },
    
  containsProtocol: function(protocolArray, protocolName) {
	 
         if ( protocolName == undefined ) return false
         
         for (var i=0; i < protocolArray.length; i++) {

            if (protocolArray[i].trim() == protocolName.trim()) {
                return true;
            }
	 }
	 
	 return false;
  },
  
  addLinkDataToCart: function(rec) {
      
    var links = rec.get('links');
    var maxCartSize = Portal.app.config.downloadCartMaxNumFiles;
    var downloadableProtocols = Portal.app.config.downloadCartDownloadableProtocols.split("\n");

    for (var i = 0; i < links.length; i++) {

        if ( getDownloadCartSize() >= maxCartSize ) {
            
            if ( this.maximumFileAlertShown != true ) {

                Ext.Msg.alert( OpenLayers.i18n('titlFileLimitReached'), OpenLayers.i18n('msgFileLimitReached', {limit: maxCartSize}) );
            
                this.maximumFileAlertShown = true;
            }
            
            break;
        }
        
        var link = links[i];
        
        if ( this.containsProtocol( downloadableProtocols, link.protocol ) ) {
            
            addToDownloadCart(link.title, link.type, link.href, link.protocol);
        }
    }
  },
  
  getLayerLink: function(rowIndex) {
     var rec = this.store.getAt(rowIndex);
     var links = rec.get('links');
     var linkStore = new Portal.search.data.LinkStore({
    	data: {links: links} 
     });
     linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);
	  
     return linkStore.getLayerLink(0);
  },
  
 addToCartExecute: function(grid, rowIndex, colIndex) {
    
//     var cartStartingSize = getDownloadCartSize();
     var rec = grid.store.getAt(rowIndex);
     
     this.maximumFileAlertShown = false; // reset message
     
     this.addLinkDataToCart(rec);

//     var msg = 'Added links from <b>' + rec.get('title') + '</b>';
//     msg += '<br>Added <b>' + (getDownloadCartSize() - cartStartingSize) + '</b> links(s) to download cart'; 
//    
//     Ext.Msg.alert('Add to cart', msg);
  },
  
  addAllToCartExecute: function() { // button, event
      
//        var cartStartingSize = getDownloadCartSize();
      
        this.maximumFileAlertShown = false; // reset message

        this.getStore().each(function(rec){

            this.addLinkDataToCart(rec);
        }, this);

//        var msg = 'Added links from <b>' + this.getStore().getCount() + '</b> source(s)';
//        msg += '<br>Added <b>' + (getDownloadCartSize() - cartStartingSize) + '</b> links(s) to download cart'; 
//
//        Ext.Msg.alert( 'Add all to cart', msg );
  },
    
  getLinkRec: function(rowIndex, protocols) {
    var rec = this.store.getAt(rowIndex);
    var links = rec.get('links');
    var linkStore = new Portal.search.data.LinkStore({
      data: {links: links} 
    });

    linkStore.filterByProtocols(protocols);
    return linkStore.getAt(0);
  }
});

Ext.reg('portal.search.resultsgrid', Portal.search.ResultsGrid);