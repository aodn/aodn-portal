
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
            this.map.zoomToExtent(extent, false);
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
        return Portal.utils.geo.bboxAsStringToBounds(initialBbox);
    },

  /* Override GeoExt setInitialExtent - want to reflect any pre-render extent changes  */

    setInitialExtent: function() {
        var map = this.map;

        if (this.savedExtentChange) {
            map.zoomToExtent(this.savedExtentChange, false);
        }
        else if (this.center || this.zoom != null) {
            // both do not have to be defined
            map.setCenter(this.center, this.zoom);
        }
        else if (this.extent) {
            map.zoomToExtent(this.extent, false);
        }
        else {
            map.zoomToMaxExtent();
        }

        this.initialExtentSet = true;
    }
});
