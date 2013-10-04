
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

/* Code common to main map and minimap */

Portal.common.LayerOpacitySliderFixed = Ext.extend(GeoExt.LayerOpacitySlider, {
    //WARNING, inverse doesn't won't work with this class.
        /** private: method[getOpacityValue]
     *  :param layer: ``OpenLayers.Layer`` or :class:`GeoExt.data.LayerRecord`
     *  :return:  ``Integer`` The opacity for the layer.
     *
     *  Returns the opacity value for the layer.
     *  
     * No longer messes up when min and max are different.
     */
    getOpacityValue: function(layer) {
        var value;
        if (layer && layer.opacity !== null) {
            value = parseInt(layer.opacity * 100);
            if(value < this.minValue)
            {
                value = this.minValue;
            }
        } else {
            //this is for the initial dummy layer
            //needs to be min, otherwise the slider gets confused
            // when you pass in same value for the next layer.
            value = this.minValue;
        }
        return value;
    },

        /** private: method[changeLayerOpacity]
     *  :param slider: :class:`GeoExt.LayerOpacitySlider`
     *  :param value: ``Number`` The slider value
     *
     *  Updates the ``OpenLayers.Layer`` opacity value.
     */
    changeLayerOpacity: function(slider, value) {
        if (this.layer) {
            value = value / 100;
            this._settingOpacity = true;
            this.layer.setOpacity(value);
            delete this._settingOpacity;
        }
    }
});
