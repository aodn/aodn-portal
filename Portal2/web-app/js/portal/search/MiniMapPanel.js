Ext.namespace('Portal.search');

Portal.search.MiniMapPanel = Ext.extend(GeoExt.MapPanel, {
   stateId: "mappanel",
   height: 400,
   width: 600,
   center: new OpenLayers.LonLat(133, -25),
   zoom: 3,

   initComponent:function() {
      this.map = new OpenLayers.Map();

      //TODO: Base layer for map should be selectable by user - should be a configurable default
      var layer = new OpenLayers.Layer.WMS(
         "World Bathymetry",
         "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi", 
         {layers: "HiRes_aus-group"},
         {tileSize: new OpenLayers.Size(256,256), buffer: 1 }
      );
      
      this.map.addLayer(layer);
      this.map.addControl(new OpenLayers.Control.LayerSwitcher());
      
      this.map.events.register('zoomend', this, this.mapZoomEnd);
       
      Portal.search.MiniMapPanel.superclass.initComponent.apply(this, arguments);
      
      this.addEvents('extentchange');
   },
   
   mapZoomEnd: function() {
      var bounds = this.map.getExtent();
      this.fireEvent('extentchange', {northBL: bounds.top, westBL: bounds.left, eastBL: bounds.right, southBL: bounds.bottom});
   }
});

Ext.reg('portal.search.minimappanel', Portal.search.MiniMapPanel);
    
