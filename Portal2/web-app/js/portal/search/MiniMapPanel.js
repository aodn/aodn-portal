Ext.namespace('Portal.search');

Portal.search.MiniMapPanel = Ext.extend(GeoExt.MapPanel, {
   stateId: "mappanel",
   height: 400,
   width: 600,
   center: new OpenLayers.LonLat(133, -25),
   zoom: 3,
   
   bboxLayerStyle: OpenLayers.Util.extend({
	   fillOpacity: 0.3,
	   strokeWidth: 3  
   }, OpenLayers.Feature.Vector.style['default']),

   initComponent:function() {
      this.map = new OpenLayers.Map();

      //TODO: Base layer should be same as main map one
      // and should change when that one is changed.
      var layer = new OpenLayers.Layer.WMS(
         "World Bathymetry",
         "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi", 
         {layers: "HiRes_aus-group"},
         {tileSize: new OpenLayers.Size(256,256), buffer: 1 }
      );
      
      this.map.addLayer(layer);
      this.map.addControl(new OpenLayers.Control.LayerSwitcher());
      
      this.map.events.register('zoomend', this, this.extentChange);
      this.map.events.register('moveend', this, this.extentChange);
      
      this.bboxLayer = new OpenLayers.Layer.Vector(OpenLayers.i18n("bboxLayer"), this.bboxLayerStyle);
      this.map.addLayer(this.bboxLayer);
       
      Portal.search.MiniMapPanel.superclass.initComponent.apply(this, arguments);
      
      this.addEvents('extentchange');
   },
   
   extentChange: function() {
      var bounds = this.map.getExtent();
      this.fireEvent('extentchange', {northBL: bounds.top, westBL: bounds.left, eastBL: bounds.right, southBL: bounds.bottom});
   },
   
   showLayer: function(layerInfo) {
	  this.clearOverlays();
      var newLayer = new OpenLayers.Layer.WMS(
    	         layerInfo.name,
    	         layerInfo.server.uri, 
    	         {layers: layerInfo.layers, transparent: true},
    	         {isBaseLayer: false, wrapDateLine: true}
    	      );
      this.map.addLayer(newLayer);
   },
   
   showBBox: function(bbox) {
       var polygons = [];
	   for (var i = 0; i<bbox.length; i++ ) {
		   var value = bbox[i].value;
           var p1 = new OpenLayers.Geometry.Point(value[2], value[1]);
           var p2 = new OpenLayers.Geometry.Point(value[2], value[3]);
           var p3 = new OpenLayers.Geometry.Point(value[0], value[3]);
           var p4 = new OpenLayers.Geometry.Point(value[0], value[1]);
           var pointList = [p1, p2, p3, p4, p1];
           var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
           var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
           polygons.push(polygon);
	   }
       var multipolygon = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(polygons), {});
       this.bboxLayer.addFeatures(multipolygon);

   },
   
   clearBBox: function(bbox) {
	   this.bboxLayer.removeAllFeatures();
   },
   
   clearOverlays: function() {
	   var num = this.map.getNumLayers(); 
	   for (var i = num - 1; i >= 0; i--) { 
		   if (!this.map.layers[i].isBaseLayer && this.map.layers[i] !== this.bboxLayer) {
			   this.map.layers[i].destroy();
		   }
	   }
   }
});

Ext.reg('portal.search.minimappanel', Portal.search.MiniMapPanel);
    
