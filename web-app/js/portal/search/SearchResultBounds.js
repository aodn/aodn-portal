/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.SearchResultsBounds = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(cfg) {
        this.bboxPerc = 10;
        Ext.apply(this, cfg);
        Portal.search.SearchResultsBounds.superclass.constructor.apply(this, arguments);
    },

    _extendBbox: function() {
        // The ultimate aim is to have the bounding box of the search result cover n% of the map, or if its too big
        // use the max extent
        var _bbox = this.bbox;
        var lonDiff = _bbox.east - _bbox.west;
        _bbox.east = _bbox.east + (lonDiff * this.bboxPerc);
        _bbox.west = _bbox.west - (lonDiff * this.bboxPerc);

        var latDiff = _bbox.north - _bbox.south;
        var maxBounds = this._maxBounds().toArray();
        var maxLonDiff = maxBounds[2] - maxBounds[0];
        var maxLatDiff = maxBounds[1] - maxBounds[3];

        return (new OpenLayers.Bounds(bbox.west - lonDiff, bbox.south - latDiff, bbox.east + lonDiff, bbox.north + lonDiff));
    },

    _maxBounds: function() {
        // This is an arbitrary bounds size, it appears to be about the largest you can have that fits
        // within the size of the div as it is currently set
        return new OpenLayers.Bounds(-100, -80, 180, 60);
    },

    _eastBound: function() {
        var east = this.bbox.east;
        if (east < 0) {
            east = east - (this._longitudeDiff() * this.bboxPerc);
            if (east < -180) {
                east = 180;
            }
        }
        else {
            east = east + (this._longitudeDiff() * this.bboxPerc);
            if (east > 180) {
                // Cross the anti-meridian
                east = -180 + (east - 180);
            }
        }
        return east;
    },

    _longitudeDiff: function() {
        if (this.bbox.east < 0 && this.bbox.west >= 0) {
            return (180 + this.bbox.east) + (180 - this.bbox.west);
        }
        return this.bbox.east - this.bbox.west;
    },

    _latitudeDiff: function() {
        return this.bbox.north - this.bbox.south;
    }
});