/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.GeoFacetMapToolbar", function() {

    var toolbar;
    var layer;

    beforeEach(function() {
        toolbar = new Portal.search.GeoFacetMapToolbar();
    });

    describe('controls', function() {
        it('navigation', function() {
            expect(toolbar.controls[0]).toBeInstanceOf(OpenLayers.Control.Navigation);
        });

        it('draw feature', function() {
            expect(toolbar.controls[1]).toBeInstanceOf(Portal.ui.openlayers.control.SpatialConstraint);
        });

        it('activate default control', function() {
            spyOn(toolbar.spatialConstraintControl, 'activate');
            toolbar.activateDefaultControl();
            expect(toolbar.spatialConstraintControl.activate).toHaveBeenCalled();
        });
    });

    describe('events', function() {
        it("fires 'spatialconstraintadded'", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            toolbar.events.on({
                'spatialconstraintadded': eventSpy
            });

            toolbar.spatialConstraintControl.events.triggerEvent('spatialconstraintadded');

            expect(eventSpy).toHaveBeenCalled();
        });

        it("fires 'spatialconstraintcleared'", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintcleared');
            toolbar.events.on({
                'spatialconstraintcleared': eventSpy
            });

            toolbar.spatialConstraintControl.events.triggerEvent('spatialconstraintcleared');

            expect(eventSpy).toHaveBeenCalled();
        });
    });
});
