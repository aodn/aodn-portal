describe("Portal.details.SpatialConstraintDisplayPanel", function() {

    var displayPanel;
    var map;

    beforeEach(function() {

        Ext.layout.CardLayout.prototype.setActiveItem = noOp;

        map = new OpenLayers.SpatialConstraintMap();
        map.toolPanel = new OpenLayers.Control.Panel();
        displayPanel = new Portal.details.SpatialConstraintDisplayPanel({
            map: map
        });
        displayPanel.rendered = true;
        displayPanel.layout.activeItem = displayPanel.activeItem;
    });

    describe('map', function() {

        it("subscribes to 'spatialconstrainttypechanged' event", function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(displayPanel, '_showCard');

            map.events.triggerEvent('spatialconstrainttypechanged',"Some Type");
            expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.emptyPolygonDisplayPanel, undefined);
        });

        it("subscribes to 'spatialconstraintadded' event", function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(displayPanel.polygonDisplayPanel, 'setGeometry');
            var geometry = constructGeometry();

            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(displayPanel.polygonDisplayPanel.setGeometry).toHaveBeenCalled();
        });

        it("subscribes to 'spatialconstraintcleared' event", function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(displayPanel, '_showCard');

            map.events.triggerEvent('spatialconstraintcleared');

            expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.boxDisplayPanel);
        });

    });

    describe('box, polygon or none', function() {
        it('initialises with card layout', function() {
            expect(displayPanel.layout).toBeInstanceOf(Ext.layout.CardLayout);
        });

        it('initialises with "boxDisplayPanel" as active item', function() {
            expect(displayPanel.activeItem).toBe(displayPanel.boxDisplayPanel);
        });

        describe('spatial constraint added', function() {

            it('shows box display panel when constraint is a box with area', function() {

                var geometry = new OpenLayers.Bounds(160,-30,170,10).toGeometry();

                spyOn(displayPanel, '_showCard');

                map.events.triggerEvent('spatialconstraintadded', geometry);

                expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.boxDisplayPanel, geometry);
            });


            it('shows point display panel when constraint is a box without area', function() {

                var geometry = new OpenLayers.Bounds(160,10,160,10).toGeometry();

                spyOn(displayPanel, '_showCard');

                map.events.triggerEvent('spatialconstraintadded', geometry);

                expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.pointDisplayPanel, geometry);
            });

            it('shows polygon display panel when constraint is polygon', function() {
                var geometry = {
                    isBox: returns(false)
                };

                spyOn(displayPanel, '_showCard');

                map.events.triggerEvent('spatialconstraintadded', geometry);

                expect(displayPanel._showCard).toHaveBeenCalled();
            });

            it('shows none display panel when constraint is cleared', function() {
                spyOn(displayPanel, '_showCard');
                map.events.triggerEvent('spatialconstraintcleared');

                expect(displayPanel._showCard).toHaveBeenCalledWith(displayPanel.boxDisplayPanel);
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
