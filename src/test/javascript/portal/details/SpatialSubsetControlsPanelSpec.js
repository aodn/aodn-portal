
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.SpatialSubsetControlsPanel", function() {

    var spatialSubsetControlsPanel;
    var map;

    beforeEach(function() {

        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.spatialConstraintControl = {};
        map.spatialConstraintControl.clear = noOp();
        map.spatialConstraintControl.getConstraint = function() {return null};
        map.navigationControl.deactivate = function() {return null};

        spyOn(window, 'trackUsage');

        spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: map,
            typeLabel: OpenLayers.i18n('spatialExtentHeading')
        });
    });

    describe('handleRemoveFilter', function() {
        it('clears the spatial constraint', function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(map.spatialConstraintControl, 'clear');
            spyOn(map.events, 'triggerEvent');

            spatialSubsetControlsPanel.handleRemoveFilter();
            expect(map.spatialConstraintControl.clear).toHaveBeenCalled();
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Spatial Constraint", "cleared", undefined);
        });
    });
});
