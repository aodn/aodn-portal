Ext.namespace('Portal.search');

Portal.search.MiniMapPanel = Ext.extend(GeoExt.MapPanel, {
  
   constructor: function(cfg) {
     this.initMap();
     
     var config = Ext.apply({
       height: 400,
       width: 600,
       center: new OpenLayers.LonLat(133, -25),
       zoom: 3
     }, cfg);
     
     Portal.search.MiniMapPanel.superclass.constructor.call(this, config);

     this.bind(cfg.mainMap);
     
     this.registerExtentChangeEvents();
     
     this.doLayout(false, true);
   },

   initMap: function() {
     this.map = new OpenLayers.Map();
     
     this.initBBoxLayer();
   },
   
   initBBoxLayer: function() {
     var bboxLayerStyle = OpenLayers.Util.extend({
       fillOpacity: 0.3,
       strokeWidth: 3  
     }, OpenLayers.Feature.Vector.style['default']);
     
     this.bboxLayer = new OpenLayers.Layer.Vector(OpenLayers.i18n("bboxLayer"), bboxLayerStyle);
     this.map.addLayer(this.bboxLayer);
   },
   
   // Synchronise with main map layer and extent changes
   
   bind: function(mainMap) {
     if (!mainMap) return;
     
     this.mainMap = mainMap;
     
     mainMap.map.events.register('addlayer', this, this.mainMapLayerAdded);
     mainMap.map.events.register('removelayer', this, this.mainMapLayerRemoved);
     mainMap.map.events.register('changelayer', this, this.mainMapLayerChanged);
     mainMap.map.events.register('zoomend', this, this.mainMapExtentChange);
     mainMap.map.events.register('moveend', this, this.mainMapExtentChange);
   },
   
   mainMapLayerAdded: function(e) {
     var miniMapClone = e.layer.clone();
     //HACK: clone doesn't clear numloadinglayers causing problems clearing backbuffer tiles
     miniMapClone.numLoadingTiles = 0;
     miniMapClone.sourceLayer = e.layer;
     this.map.addLayer(miniMapClone);
     this.applyMainMapLayerOrdering();
   },
   
   mainMapLayerRemoved: function(e) {
     var miniMapClone = this.map.getLayersBy('sourceLayer', e.layer)[0];
     
     this.map.removeLayer(miniMapClone);
   },
   
   mainMapLayerChanged: function(e) {
     var miniMapClone = this.map.getLayersBy('sourceLayer', e.layer)[0];
     
     // When adding baselayers some property change events come before the addlayer event
     // ignore them - properties will be set correctly when the layer is actually added
     if (!miniMapClone) return;
     
     this.applyLayerChange(miniMapClone, e.layer, e.property);
   },
   
   applyLayerChange: function(target, source, property) {
     if (property == 'name') {
       target.setName(source.name);
     } else if (property == 'order') {
       this.applyMainMapLayerOrdering();
     } else if (property == 'opacity') {
       target.setOpacity(source.opacity);
     } else if (property == 'params') {
       target.mergeNewParams(source.params);
     } else if (property == 'visibility') {
       this.setLayerVisibility(target, source.getVisibility());
     }
   },
   
   setLayerVisibility: function(layer, visibility) {
     if (layer.isBaseLayer) {
       if (visibility) this.map.setBaseLayer(layer);
     } else {
       layer.setVisibility(visibility);
     }     
   },
   
   applyMainMapLayerOrdering: function() {
     var nonMainMapLayerCount = this.countNonMainMapLayers();
     
     for (var mainMapLayerIndex=0; mainMapLayerIndex<this.mainMap.map.layers.length; mainMapLayerIndex++) {
       var mainLayer = this.mainMap.map.layers[mainMapLayerIndex];
       var miniMapClone = this.map.getLayersBy('sourceLayer', mainLayer)[0];
       // main map layers come after mini map layers (i.e. bbox is displayed on top of main map layers)
       this.map.setLayerIndex(miniMapClone, nonMainMapLayerCount + mainMapLayerIndex);
     }
   },
   
   countNonMainMapLayers: function() {
     var nonMainMapLayerCount = 0;
     var miniMapLayers = this.map.layers;
     
     for (var i=0; i<miniMapLayers.length; i++) {
       if (miniMapLayers[i] == undefined) {
         nonMainMapLayerCount++;
       }
     }
     
     return nonMainMapLayerCount;
   },
   
   mainMapExtentChange: function() {
     var mainMapExtent = this.mainMap.map.getExtent();
     
     this.map.zoomToExtent(mainMapExtent, true);
   },
   
   registerExtentChangeEvents: function() {
     this.addEvents('extentchange');

     this.map.events.register('zoomend', this, this.extentChange);
     this.map.events.register('moveend', this, this.extentChange);
   },
   
   extentChange: function() {
     if (this.disableExtentChangeEvents) return;
     
      var bounds = this.map.getExtent();
      this.fireEvent('extentchange', {northBL: bounds.top, westBL: bounds.left, eastBL: bounds.right, southBL: bounds.bottom});
   },
   
   setExtent: function(bounds) {
     var olBounds = new OpenLayers.Bounds(bounds.westBL, bounds.southBL, bounds.eastBL, bounds.northBL);
     
     // don't trigger extentchange event when setExtent method is used
     this.disableExtentChangeEvents = true;

     this.map.zoomToExtent(olBounds, false);

     this.disableExtentChangeEvents = false;
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
   
});

Ext.reg('portal.search.minimappanel', Portal.search.MiniMapPanel);
    
