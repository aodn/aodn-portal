/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
package au.org.emii.portal

/**
 * Some layers have a bounding box which crosses the international data line.  Due to limitations
 * in geoserver (apparently), this is creating a problem with the "zoom to layer" functionality
 * zooming out so that the whole world is visible.  This class serves as a work-around/override
 * for the problemetic layers (of which, there are only a handful).
 */
class LayerViewParameters {

    Float centreLat
    Float centreLon
    Integer openLayersZoomLevel

    static belongsTo = [layer: Layer]
    static constraints = {

        centreLat min: -90f, max: 90f
        centreLon min: -180f, max: 180f
        openLayersZoomLevel min: 0
    }
}
