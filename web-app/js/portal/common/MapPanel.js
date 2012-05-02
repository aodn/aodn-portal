Ext.namespace('Portal.common');

/* Code common to main map and minimap */

Portal.common.MapPanel = Ext.extend(GeoExt.MapPanel, {

  setExtent: function(extent) {
    this.extent = extent;
    
    if (this.initialExtentSet) {
      map.zoomToExtent(this.extent, true);
    }
  },
  
  /* Override GeoExt setInitialExtent - want a best fit zoom */

  setInitialExtent: function() {
    var map = this.map;
    if(this.center || this.zoom != null) {
        // both do not have to be defined
        map.setCenter(this.center, this.zoom);
    } else if(this.extent) {
        map.zoomToExtent(this.extent, true);
    } else {
        map.zoomToMaxExtent();
    }
    this.initialExtentSet = true;
  }
});

