/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.SearchResultsBounds = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(cfg) {
        this.bboxPerc = 30;
        Ext.apply(this, cfg);

        // The extent will be this many times the size of the bounding box
        this.extentMult = 100 / this.bboxPerc;

        Portal.search.SearchResultsBounds.superclass.constructor.apply(this, arguments);
    },

    getCentreLonLat: function() {
        return this._toBounds().getCenterLonLat();
    },

    extendBounds: function() {
        if (this._isLongestBoundingEdgeLongitude()) {
            this._extendBoundsEastWest(this._longestBoundingEdgeLength() * this.extentMult - this._longitudeDiff());
        }
        else {
            this._extendBoundsNorthSouth(this._longestBoundingEdgeLength() * this.extentMult - this._latitudeDiff());
        }

        // If we exceed the max bounds size in any direction we need to pull it back
        this._checkExceedsMaxBounds();

        return this._toBounds();
    },

    _toBounds: function() {
        return new OpenLayers.Bounds(this.bbox.west, this.bbox.south, this.bbox.east, this.bbox.north);
    },

    _longestBoundingEdgeDirection: function() {
        if (this._longitudeDiff() > this._latitudeDiff()) {
            return "longitude";
        }
        return "latitude";
    },

    _longestBoundingEdgeLength: function() {
        if (this._longitudeDiff() > this._latitudeDiff()) {
            return this._longitudeDiff();
        }
        return this._latitudeDiff();
    },

    _isLongestBoundingEdgeLongitude: function() {
        return "longitude" == this._longestBoundingEdgeDirection();
    },

    _isLongestBoundingEdgeLatitude: function() {
        return "latitude" == this._longestBoundingEdgeDirection();
    },

    _extendBoundsEastWest: function(extendBy) {
        this._extendEast(extendBy);
        this._extendWest(extendBy);
        var ratio = this._eastWestExtensionRatio();
        var northSouthExtension = ratio * this._latitudeDiff();
        this._extendNorth(northSouthExtension);
        this._extendSouth(northSouthExtension);
    },

    _extendBoundsNorthSouth: function(extendBy) {
        this._extendNorth(extendBy);
        this._extendSouth(extendBy);
        var ratio = this._northSouthExtensionRatio();
        var eastWestExtension = ratio * this._longitudeDiff();
        this._extendEast(eastWestExtension);
        this._extendWest(eastWestExtension);
    },

    _extendEast: function(extendBy) {
        this.bbox.east = this.bbox.east + extendBy;
        if (this.bbox.east > 180) {
            this.bbox.east = -180 + (this.bbox.east - 180);
        }
    },

    _extendWest: function(extendBy) {
        this.bbox.west = this.bbox.west - extendBy;
        if (this.bbox.west < -180) {
            this.bbox.west = 180 + (this.bbox.west + 180);
        }
    },

    _extendNorth: function(extendBy) {
        this.bbox.north = this.bbox.north + extendBy;
        if (this.bbox.north < 90) {
            this.bbox.north = 90;
        }
    },

    _extendSouth: function(extendBy) {
        this.bbox.south = this.bbox.south - extendBy;
        if (this.bbox.south < -90) {
            this.bbox.south = -90;
        }
    },

    _eastWestExtensionRatio: function() {
        var compass = this._maxBounds().toArray();
        return this._longitudeDiff() / (compass[2] - compass[0]);
    },

    _northSouthExtensionRatio: function() {
        var compass = this._maxBounds().toArray();
        return this._latitudeDiff() / (compass[3] - compass[1]);
    },

    _checkExceedsMaxBounds: function() {
        var bounds = this._toBounds();
        var max = this._maxBounds();
        if (bounds.getWidth() > max.getWidth() || bounds.getHeight() > max.getHeight()) {

        }
    },

    _maxBounds: function() {
        // This is an arbitrary bounds size, it appears to be about the largest you can have that fits
        // within the size of the div as it is currently set
        return new OpenLayers.Bounds(120, -45, 160, -5);
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