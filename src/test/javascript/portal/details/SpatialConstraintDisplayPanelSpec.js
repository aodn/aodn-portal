
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.SpatialConstraintDisplayPanel", function() {

    var displayPanel;
    var map;

    beforeEach(function() {

        Ext.layout.CardLayout.prototype.setActiveItem = noOp;

        map = new OpenLayers.Map();
        displayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: map
        });
        displayPanel.rendered = true;
        displayPanel.layout.activeItem = displayPanel.activeItem;
    });


    describe('map', function() {

        it("subscribes to 'spatialconstraintadded' event", function() {
            var spatialConstraintControl = Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(displayPanel.polygonDisplayPanel, 'setGeometry');
            var geometry = constructGeometry();

            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(displayPanel.polygonDisplayPanel.setGeometry).toHaveBeenCalled();
        });
    });

    describe('box or polygon', function() {
        it('initialises with card layout', function() {
            expect(displayPanel.layout).toBeInstanceOf(Ext.layout.CardLayout);
        });

        describe('spatial constraint added', function() {

            it('shows box display panel when constraint is box', function() {
                var geometry = {
                    isBox: function() { return true; }
                };

                spyOn(displayPanel, '_showCard');

                map.events.triggerEvent('spatialconstraintadded', geometry);

                expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.boxDisplayPanel, geometry);
            });

            it('shows polygon display panel when constraint is polygon', function() {
                var geometry = {
                    isBox: function() { return false; }
                };

                spyOn(displayPanel, '_showCard');

                map.events.triggerEvent('spatialconstraintadded', geometry);

                expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.polygonDisplayPanel, geometry);
            });
        });

        describe('show card', function() {
            it('sets geometry on card', function() {
                var geometry = {};
                spyOn(displayPanel.layout.activeItem, 'setGeometry');
                displayPanel._showCard(displayPanel.layout.activeItem, geometry);
                expect(displayPanel.layout.activeItem.setGeometry).toHaveBeenCalledWith(geometry);
            });
        });
    });
});
