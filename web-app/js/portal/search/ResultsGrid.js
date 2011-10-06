Ext.namespace('Portal.search');

Portal.search.ResultsGrid = Ext.extend(Ext.grid.GridPanel, {
   frame: true,
   
  initComponent: function() {
     var config = {
        colModel: new Ext.grid.ColumnModel({
           columns: [
               {
                  header: 'Logo', 
                  width: 50,
                  xtype: 'templatecolumn',
                  //TODO: Use configurable geonetwork url
                  tpl: '<img class="p-logo" src="'+Portal.app.config.catalogUrl+'images/logos/{source}.gif"/>',
                  dataIndex: 'source'
               },{
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
                  width: 100,
                  xtype: 'actioncolumn',
                  items: [{
                     iconCls: 'p-result-info',
                     tooltip: 'View metadata',
                     width: 35,
                     height: 35,
                     handler: this.viewMetadataExecute,
                     scope: this
                  },{
                     iconCls: 'p-result-map-add',
                     tooltip: 'Add to map',
                     width: 35,
                     height: 35,
                     handler: this.addToMapExecute,
                     scope: this
                  }]
               }
           ]
       }),
        bbar: new Ext.PagingToolbar({
           pageSize: 15
        })
     };
 
     //TODO: pull strings out into separate file - i18n style 
    
     Ext.apply(this, Ext.apply(this.initialConfig, config));
 
     Portal.search.ResultsGrid.superclass.initComponent.apply(this, arguments);
     
     // TODO: remove HACK - Set store - don't bind it 
     this.getBottomToolbar().store = this.store;
  },
  
  viewMetadataExecute: function(grid, rowIndex, colIndex) {
     var rec = this.store.getAt(rowIndex);
     //TODO: allow service url to be configured
     var viewmetadata = Portal.app.config.catalogUrl + 'srv/en/metadata.show\?uuid\='+rec.get('uuid');
     
     window.open(viewmetadata,'_blank','width=1000,height=800,toolbar=yes,resizable=yes');
           
  },
 
  addToMapExecute: function(grid, rowIndex, colIndex) {
     Ext.Msg.alert('Not yet implemented');
  }
 
});

Ext.reg('portal.search.resultsgrid', Portal.search.ResultsGrid);