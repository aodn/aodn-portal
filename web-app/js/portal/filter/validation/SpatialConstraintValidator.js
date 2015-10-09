Ext.namespace('Portal.filter.validation');

Portal.filter.validation.SpatialConstraintValidator = Ext.extend(Object, {

    MIN_AREA_PERCENT: 0.01,

    constructor: function(cfg) {
        Ext.apply(this, cfg);

        Portal.filter.validation.SpatialConstraintValidator.superclass.constructor.call(this, cfg);
    },

    isValid: function(geometry) {
        return this._isLargeEnough(geometry) && !geometry.crossesAntimeridian();
    },

    _isLargeEnough: function(geometry) {
        var area = geometry.getArea();
        return this._getPercentOfViewportArea(area) > this.MIN_AREA_PERCENT;
    },

    _getPercentOfViewportArea: function(spatialExtentArea) {
        var mapArea = this._getMapArea();
        return (spatialExtentArea / parseFloat(mapArea)) * 100;
    },

    _getMapArea: function() {
        return this.map.getExtent().toGeometry().getArea();
    }
});