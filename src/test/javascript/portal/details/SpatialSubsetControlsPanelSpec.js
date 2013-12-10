
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.SpatialSubsetControlsPanel", function() {

    var spatialSubsetControlsPanel;

    beforeEach(function() {

        spyOn(Ext.layout.CardLayout.prototype, 'setActiveItem');

        spatialSubsetControlsPanel = new Portal.details.SpatialSubsetControlsPanel({
            map: new OpenLayers.Map()
        });
        spatialSubsetControlsPanel.spatialConstraintDisplayPanel.rendered = true;
        spatialSubsetControlsPanel.spatialConstraintDisplayPanel.layout.activeItem = spatialSubsetControlsPanel.spatialConstraintDisplayPanel.activeItem;
    });
});
