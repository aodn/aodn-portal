/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.MiniMapColumn = Ext.extend(Ext.grid.Column, {

    renderer: function(value, metaData, record, rowIndex) {
        var me = this;
        var componentId = Ext.id();
        var metadataExtent = record.get('bbox');
        var map = new OpenLayers.Map({
            controls: []
        });
        map.addLayer(this._baseLayer());
        map.addLayer(metadataExtent.getLayer());

        setTimeout(function() {
            map.render(componentId);
            if (metadataExtent.getBounds()) {
                map.setCenter(metadataExtent.getBounds().getCenterLonLat(), me._zoomLevel(map, metadataExtent.getBounds()));
            }
        }, 10);

        return('<div id="' + componentId + '" style="width: ' + this.width + 'px; height: ' + this.height + 'px;"></div>');
    },

    _baseLayer: function() {
        return new OpenLayers.Layer.WMS(
            "IMOS Tile Cache Simple Baselayer",
            "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi/1.0.0/",
            { layers: 'default_basemap_simple' }
        );
    },

    _zoomLevel: function(map, bounds) {
        var zoomLevel = map.getZoomForExtent(bounds);
        if (zoomLevel == 0) {
            // 0 is too large
            zoomLevel = 1;
        }
        else if (zoomLevel > 4) {
            // Anything over 4 doesn't show enough to get an idea of where things are
            zoomLevel = 4;
        }
        return zoomLevel;
    }
});

Ext.grid.Column.types.minimapcolumn = Portal.search.MiniMapColumn;
