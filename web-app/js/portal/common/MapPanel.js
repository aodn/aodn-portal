
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
        }
        else {
            this.savedExtentChange = extent;
        }
    },

    zoomToInitialBbox: function() {
        this.setExtent(this.extent);
    },

    /* Return an openlayers extent for the passed initialBbox string */
    getMapDefaultZoom: function(initialBbox) {

        if (!initialBbox) {
            alert("ERROR: There is no bounding box is not set in the site configuration");
            return null;
        }

        return Portal.utils.geo.bboxAsStringToBounds(initialBbox);
    },

  /* Override GeoExt setInitialExtent - want a best fit zoom */
  /* and want to reflect any pre-render extent changes  */

    setInitialExtent: function() {
        var map = this.map;

        if (this.savedExtentChange) {
            map.zoomToExtent(this.savedExtentChange, true);
        }
        else if (this.center || this.zoom != null) {
            // both do not have to be defined
            map.setCenter(this.center, this.zoom);
        }
        else if (this.extent) {
            map.zoomToExtent(this.extent, true);
        }
        else {
            map.zoomToMaxExtent();
        }

        this.initialExtentSet = true;
    }
});
