
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

    describe('bounds', function() {
        it('passes setBounds through to the spatial constraint display panel', function() {
            spyOn(spatialSubsetControlsPanel.spatialConstraintDisplayPanel, 'setBounds');
            spatialSubsetControlsPanel.setBounds({bottom: -17, top: -19, left: -51, right: -13});

            expect(spatialSubsetControlsPanel.spatialConstraintDisplayPanel.setBounds).toHaveBeenCalledWith({bottom: -17, top: -19, left: -51, right: -13});
        });

        it('passes getSouthBL through to the spatial constraint display panel', function() {
            spyOn(spatialSubsetControlsPanel.spatialConstraintDisplayPanel, 'getSouthBL');
            spatialSubsetControlsPanel.getSouthBL();

            expect(spatialSubsetControlsPanel.spatialConstraintDisplayPanel.getSouthBL).toHaveBeenCalled();
        });

        it('passes getNorthBL through to the spatial constraint display panel', function() {
            spyOn(spatialSubsetControlsPanel.spatialConstraintDisplayPanel, 'getNorthBL');
            spatialSubsetControlsPanel.getNorthBL();

            expect(spatialSubsetControlsPanel.spatialConstraintDisplayPanel.getNorthBL).toHaveBeenCalled();
        });

        it('passes getEastBL through to the spatial constraint display panel', function() {
            spyOn(spatialSubsetControlsPanel.spatialConstraintDisplayPanel, 'getEastBL');
            spatialSubsetControlsPanel.getEastBL();

            expect(spatialSubsetControlsPanel.spatialConstraintDisplayPanel.getEastBL).toHaveBeenCalled();
        });

        it('passes getWestBL through to the spatial constraint display panel', function() {
            spyOn(spatialSubsetControlsPanel.spatialConstraintDisplayPanel, 'getWestBL');
            spatialSubsetControlsPanel.getWestBL();

            expect(spatialSubsetControlsPanel.spatialConstraintDisplayPanel.getWestBL).toHaveBeenCalled();
        });
    });
});
