Ext.namespace('Portal.common');

/* Code common to main map and minimap */

Portal.common.MapPanel = Ext.extend(GeoExt.MapPanel, {

  constructor: function(cfg) {
    var defaultZoom = this.getMapDefaultZoom(cfg.initialBbox);
    
    var config = Ext.apply({
      extent: defaultZoom,
      stateful: false
    }, cfg);

    Portal.common.MapPanel.superclass.constructor.call(this, config);
  },

  /* setExtent method for use when the map may not yet have been rendered */
  /* Either makes changes to the rendered map or saves them until they can be made */
  setExtent: function(extent) {
    if (this.initialExtentSet) {
      this.map.zoomToExtent(extent, true);
    } else {
      this.savedExtentChange = extent;
    }
  },
  
  zoomToInitialBbox: function() {
    this.setExtent(this.extent);
  },
  
  /* Return an openlayers extent for the passed initialBbox string */
  
  getMapDefaultZoom: function(initialBbox) {
    /* ---------------
       * left {Number} The left bounds of the box.  Note that for width calculations, this is assumed to be less than the right value.
       * bottom {Number} The bottom bounds of the box.  Note that for height calculations, this is assumed to be more than the top value.
       * right  {Number} The right bounds.
       * top  {Number} The top bounds.
      */
    if (!initialBbox) {
      alert("ERROR: There is no bounding box is not set in the site configuration");
      return null;
    }
    
    var bbox = initialBbox.split(",");
    
    var minx = parseFloat(bbox[0]);
    var maxx = parseFloat(bbox[2]);
    var miny = parseFloat(bbox[1]);
    var maxy = parseFloat(bbox[3]);
    
    if (!((minx >= -180 && minx <= 180)
      && (maxx > -180 && maxx <= 180)
      && (miny >= -90 && miny <= 90)
      && (maxy >= -90 && maxy <= 90)
      && minx < maxx
      && miny < maxy))
      {
      alert("ERROR: wrong value in bbox ! \n\n" + 
        minx + 
        ":West = "+(minx >= -180 && minx <= 180)+"\n" + 
        miny +
        ":South = "+(miny >= -90 && miny <= 90) +"\n" + 
        maxx + 
        ":East = "+ (maxx > -180 && maxx <= 180)+"\n" + 
        maxy + 
        ":North = "+(maxy >= -90 && maxy <= 90) +
        "\n West > East = " + (minx < maxx) + 
        "\n South < North = " +(miny < maxy) 
        );
      return null;
    }
    
    return new OpenLayers.Bounds(minx, miny, maxx, maxy);
  },
  
  /* Override GeoExt setInitialExtent - want a best fit zoom */
  /* and want to reflect any pre-render extent changes  */

  setInitialExtent: function() {
    var map = this.map;
    
    if (this.savedExtentChange) {
        map.zoomToExtent(this.savedExtentChange, true);
    } else if(this.center || this.zoom != null) {
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

