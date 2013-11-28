/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MapPanel", function() {

    Ext.Ajax.request.isSpy = false;
    spyOn(Ext.Ajax, 'request').andReturn('');

    var appConfig = {
        initialBbox : '130,-60,160,-20',
        autoZoom : false,
        hideLayerOptions : false
    };

    var mapPanel;

    beforeEach(function() {
        mapPanel = new Portal.ui.MapPanel({
            appConfig : appConfig
        });
    });

    describe('message bus tests', function() {

        it('on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'zoomToLayer');

            mapPanel.autoZoom = true;
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);

            expect(mapPanel.zoomToLayer).toHaveBeenCalled();
        });

        it('on baseLayerChanged event', function() {
            spyOn(mapPanel, 'onBaseLayerChanged');

            var baseLayerRecord = { layer: "asdf" };
            Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_CHANGED, baseLayerRecord);

            expect(mapPanel.onBaseLayerChanged).toHaveBeenCalledWith(baseLayerRecord);
        });
    });

    describe('zoom to layer tests', function() {

        var openLayer = new OpenLayers.Layer.WMS();
        openLayer.server = { type: "WMS-1.1.0" };

        beforeEach(function() {
            spyOn(mapPanel, 'zoomTo');
            spyOn(mapPanel.map, 'setCenter');
        });

        it('zoomTo not called for layer without bounds', function() {

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).not.toHaveBeenCalled();
            expect(mapPanel.map.setCenter).not.toHaveBeenCalled();
        });

        it('zoomTo called for layer with bounds', function() {

            openLayer.bboxMinX = 10;
            openLayer.bboxMinY = 10;
            openLayer.bboxMaxX = 20;
            openLayer.bboxMaxY = 20;

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).toHaveBeenCalled();
            expect(mapPanel.map.setCenter).not.toHaveBeenCalled();
        });

        it('zoomToLayer called with layer having zoom override', function() {
            openLayer.zoomOverride = {
                centreLon: 12,
                centreLat: 34,
                openLayersZoomLevel: 5
            };

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).not.toHaveBeenCalled();
            expect(mapPanel.map.setCenter).toHaveBeenCalled();
        });
    });

    describe('reset event', function() {

        it('should call reset()', function() {

            spyOn(mapPanel, 'reset');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel.reset).toHaveBeenCalled();
        });

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('geonetwork record added event', function() {
        it('maximises map actions control on active geonetork record added event', function() {
            spyOn(mapPanel, '_maximiseMapActionsControl');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(mapPanel._maximiseMapActionsControl).toHaveBeenCalled();
        });

        it('calls map actions control maximise', function() {
            mapPanel.mapOptions._initMapActionsControl(mapPanel);
            spyOn(mapPanel.mapOptions.mapActionsControl, 'maximizeControl');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(mapPanel.mapOptions.mapActionsControl.maximizeControl).toHaveBeenCalled();
        });
    });

    describe('removeAllLayers event', function() {

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish('removeAllLayers');
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('Ensure the MapPanel has methods that collaborators depend on', function() {
        it('Checks that getPanelX() can be called', function() {
            expect(mapPanel.getPanelX).toBeDefined();
        });

        it('Checks that getPanelY() can be called', function() {
            expect(mapPanel.getPanelY).toBeDefined();
        });
    });

    describe('beforeParentHide()', function() {

        it('calls _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');

            mapPanel.beforeParentHide();

            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('spatial constraint', function() {

        describe('initialisation', function() {

            beforeEach(function() {
                mapPanel._setSpatialConstraintStyle('bounding box');
            });

            it('has spatial constraint control', function() {
                expect(mapPanel.map.spatialConstraintControl).toBeInstanceOf(Portal.ui.openlayers.control.SpatialConstraint);
            });

            it('is in map controls', function() {
                expect(mapPanel.map.controls).toContain(mapPanel.map.spatialConstraintControl);
            });

            it('has initial bbox equal to config', function() {
                expect(mapPanel.map.spatialConstraintControl.initialConstraint.toString()).toEqual(
                    Portal.utils.geo.bboxAsStringToGeometry(Portal.app.config.initialBbox).toString());
            });
        });

        it('is updated on polygon drawing style update', function() {
            spyOn(mapPanel, '_setSpatialConstraintStyle');
            Ext.MsgBus.publish(
                Portal.form.PolygonTypeComboBox.prototype.VALUE_CHANGED_EVENT,
                { sender: this, value: Portal.form.PolygonTypeComboBox.prototype.POLYGON }
            );
            expect(mapPanel._setSpatialConstraintStyle).toHaveBeenCalledWith(
                Portal.form.PolygonTypeComboBox.prototype.POLYGON);
        });

        describe('_setSpatialConstraintStyle', function() {
            var map;
            beforeEach(function() {
                map = mapPanel.map;

                spyOn(map.navigationControl, 'activate');
                spyOn(map.navigationControl, 'deactivate');
            });

            it('removes spatial constraint control when style is NONE', function() {
                mapPanel._setSpatialConstraintStyle(Portal.form.PolygonTypeComboBox.prototype.NONE.style);

                expect(map.spatialConstraintControl).toBeUndefined();
                Ext.each(map.controls, function(control) {
                    expect(control).not.toBeInstanceOf(Portal.ui.openlayers.control.SpatialConstraint);
                });
                expect(map.navigationControl.deactivate).toHaveBeenCalled();
                expect(map.navigationControl.activate).toHaveBeenCalled();
            });

            it('set polygon spatial constraint control when style is POLYGON', function() {
                mapPanel._setSpatialConstraintStyle(Portal.form.PolygonTypeComboBox.prototype.POLYGON.style);

                expect(map.spatialConstraintControl.handler).toBeInstanceOf(OpenLayers.Handler.Polygon);
                expect(map.spatialConstraintControl.handler).not.toBeInstanceOf(OpenLayers.Handler.RegularPolygon);
                expect(map.controls).toContain(map.spatialConstraintControl);
                expect(map.navigationControl.deactivate).toHaveBeenCalled();
            });

            it('set polygon spatial constraint control when style is BOUNDING_BOX', function() {
                mapPanel._setSpatialConstraintStyle(Portal.form.PolygonTypeComboBox.prototype.BOUNDING_BOX.style);

                expect(map.spatialConstraintControl.handler).toBeInstanceOf(OpenLayers.Handler.RegularPolygon);
                expect(map.spatialConstraintControl.handler.sides).toBe(4);
                expect(map.controls).toContain(mapPanel.map.spatialConstraintControl);
                expect(map.navigationControl.deactivate).toHaveBeenCalled();
            });
        });
    });

    Ext.Ajax.request.isSpy = false;
});
