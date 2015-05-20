/**
 * Class: OpenLayers.Format.WKTNormalised
 * Openlayers 2.13.1 is creating geometries (for EPSG:4326) with longitude sometimes represented > 180
 * WKTNormalised writes points with longitude normalized to between -180 to 180 */

OpenLayers.Format.WKTNormalised = OpenLayers.Class(OpenLayers.Format.WKT, {

    extract: {
        /**
         * @returns {String} A string of coordinates representing the point
         * with longitude normalized to between -180 to 180
         */
        'point': function(point) {
            return normaliseLongitude(point.x) + ' ' + point.y;
        },

        'multipoint': function(multipoint) {
            var array = [];
            for (var i = 0, len = multipoint.components.length; i < len; ++i) {
                array.push('(' +
                this.extract.point.apply(this, [multipoint.components[i]]) +
                ')');
            }
            return array.join(',');
        },

        'linestring': function(linestring) {
            var array = [];
            for (var i = 0, len = linestring.components.length; i < len; ++i) {
                array.push(this.extract.point.apply(this, [linestring.components[i]]));
            }
            return array.join(',');
        },

        'multilinestring': function(multilinestring) {
            var array = [];
            for (var i = 0, len = multilinestring.components.length; i < len; ++i) {
                array.push('(' +
                this.extract.linestring.apply(this, [multilinestring.components[i]]) +
                ')');
            }
            return array.join(',');
        },

        'polygon': function(polygon) {
            var array = [];
            for (var i = 0, len = polygon.components.length; i < len; ++i) {
                array.push('(' +
                this.extract.linestring.apply(this, [polygon.components[i]]) +
                ')');
            }
            return array.join(',');
        },

        'multipolygon': function(multipolygon) {
            var array = [];
            for (var i = 0, len = multipolygon.components.length; i < len; ++i) {
                array.push('(' +
                this.extract.polygon.apply(this, [multipolygon.components[i]]) +
                ')');
            }
            return array.join(',');
        },

        'collection': function(collection) {
            var array = [];
            for (var i = 0, len = collection.components.length; i < len; ++i) {
                array.push(this.extractGeometry.apply(this, [collection.components[i]]));
            }
            return array.join(',');
        }

    },

    extractGeometry: function(geometry) {
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
        if (!this.extract[type]) {
            return null;
        }
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }
        var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
        var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
        return data;
    },

    CLASS_NAME: "OpenLayers.Format.WKTNormalised"
});
