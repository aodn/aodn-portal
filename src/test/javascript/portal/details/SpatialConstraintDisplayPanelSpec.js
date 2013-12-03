
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.SpatialConstraintDisplayPanel", function() {

    var displayPanel;

    beforeEach(function() {
        displayPanel = new Portal.details.SpatialConstraintDisplayPanel();

        displayPanel.setBounds({bottom: -17, top: -19, left: -51, right: -13});
    });

    it("setBounds should set bounds of bounding box", function() {
        displayPanel.setBounds({bottom: -25, top: -22, left: -55, right: -20});

        expect(displayPanel.boxDisplayPanel.southBL.value).toBe('-25');
        expect(displayPanel.boxDisplayPanel.northBL.value).toBe('-22');
        expect(displayPanel.boxDisplayPanel.eastBL.value).toBe('-20');
        expect(displayPanel.boxDisplayPanel.westBL.value).toBe('-55');
    });

    it("getNorthBL should return north bounding latitude", function() {
        expect(displayPanel.getNorthBL()).toBe(-19);
    });

    it("getEastBL should return east bounding longitude", function() {
        expect(displayPanel.getEastBL()).toBe(-13);
    });

    it("getSouthBL should return south bounding latitude", function() {
        expect(displayPanel.getSouthBL()).toBe(-17);
    });

    it("getWestBL should return west bounding longitude", function() {
        expect(displayPanel.getWestBL()).toBe(-51);
    });

    describe('map', function() {
        var map;

        beforeEach(function() {
            map = new OpenLayers.Map();
        });

        it("subscribes to 'spatialconstraintadded' event", function() {
            var spatialConstraintControl = Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);

            displayPanel = new Portal.details.SpatialConstraintDisplayPanel({
                map: map
            });

            spyOn(displayPanel, 'setBounds');

            var geometry = constructGeometry();
            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(displayPanel.setBounds).toHaveBeenCalledWith(geometry.getBounds());
        });
    });

    describe('box or polygon', function() {
        it('initialises with card layout', function() {
            expect(displayPanel.layout).toEqual('card');
        });

        it('initialises with box panel', function() {
            expect(displayPanel.boxDisplayPanel).toBeInstanceOf(Portal.details.BoxDisplayPanel);
        });
    });
});
