
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.ResultsStore = Ext.extend(Ext.data.XmlStore, {

    constructor : function(cfg) {
        cfg = cfg || {};

        var defaults = {
        };

        var config = Ext.apply({
            record : 'metadata',
            totalProperty: 'summary/@count',
            fields: [{
                name: 'title'
            }, {
                name: 'abstract'
            }, {
                name: 'uuid',
                mapping: '*/uuid'
            }, {
                name: 'links',
                convert: this._getLinks
            }, {
                name: 'source'
            }, {
                name: 'canDownload',
                mapping: '*/canDownload',
                defaultValue: true
            }, {
                name: 'bbox',
                convert: this._getBoundingBox,
                scope: this
            }]
        }, cfg, defaults);

        Portal.data.ResultsStore.superclass.constructor.call(this, config);
    },

    _getLinks: function(v, record){
        var linkElems = Ext.DomQuery.jsSelect('link', record);
        var links = new Array();

        Ext.each(linkElems, function(link) {
            var linkValue = link.firstChild ? link.firstChild.nodeValue : null;
            var elements = linkValue.split('|');

            links.push({
                href: elements[2],
                name: elements[0],
                protocol: elements[3],
                title: elements[1],
                type: elements[4]
            });
        }, this);

        return links;
    },

    _getBoundingBox: function(v, record) {
        var store = this;
        var boundingBox = {};
        var geoBoxList = Ext.DomQuery.jsSelect('geoBox', record);
        Ext.each(geoBoxList, function(geoBox) {
            boundingBox = this._mergeBounds(boundingBox, this._toBounds(geoBox.firstChild.nodeValue));
        }, this.scope);
        return boundingBox;
    },

    _toBounds: function(geoBox) {
        var bounds = geoBox.split("|");
        return {
            west: parseFloat(bounds[0]),
            south: parseFloat(bounds[1]),
            east: parseFloat(bounds[2]),
            north: parseFloat(bounds[3])
        };
    },

    _mergeBounds: function(current, other) {
        var ret = {};
        ret.west = this._westernMost(current.west, other.west);
        ret.south = this._southernMost(current.south, other.south);
        ret.east = this._easternMost(current.east, other.east);
        ret.north = this._northernMost(current.north, other.north);
        return ret;
    },

    _westernMost: function(west1, west2) {
        return this._lesserOf(west1, west2);
    },

    _southernMost: function(south1, south2) {
        return this._lesserOf(south1, south2);
    },

    _easternMost: function(east1, east2) {
        return this._unAdjustForAntiMeridian(this._greaterOf(this._adjustForAntiMeridian(east1), this._adjustForAntiMeridian(east2)));
    },

    _northernMost: function(north1, north2) {
        return this._greaterOf(north1, north2);
    },

    _lesserOf: function(low1, low2) {
        var lesser = low1;
        if (low1 == null || (low2 != null && low2 < low1)) {
            lesser = low2;
        }
        return lesser;
    },

    _greaterOf: function(high1, high2) {
        if (high1 == null || high2 > high1) {
            return high2;
        }
        return high1;
    },

    _adjustForAntiMeridian: function(east) {
        var adjustment = east;
        if (adjustment < 0) {
            adjustment = 180 + (180 + adjustment);
        }
        return adjustment;
    },

    _unAdjustForAntiMeridian: function(east) {
        var adjustment = east;
        if (adjustment > 180) {
            adjustment = -180 + (adjustment - 180);
        }
        return adjustment;
    }
});
