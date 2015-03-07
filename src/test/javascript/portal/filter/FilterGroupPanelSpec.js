/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterGroupPanel", function() {

    var filterGroupPanel;
    var layer;
    var map;

    beforeEach(function() {
        layer = new OpenLayers.Layer.WMS();
        layer.isKnownToThePortal = function() { return true; };
        layer.geometryFilterName = "GEOMTREE";
        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.spatialConstraintControl = {};
        map.spatialConstraintControl.clear = noOp();
        map.spatialConstraintControl.getConstraint = function() {return null};
        map.spatialConstraintControl.isModified = function() {return null};
        map.spatialConstraintControl.removeFromMap = function() {return null};
        map.navigationControl.deactivate = function() {return null};

        filterGroupPanel = new Portal.filter.FilterGroupPanel({
            layer: layer,
            map: map
        });
    });

    describe('responds to expected methods', function() {
        it('has a _clearFilters method', function() {
            expect(filterGroupPanel._clearFilters).toBeDefined();
        });
    });

    describe('_showHideFilters', function() {

        beforeEach(function() {
            layer = {};
            layer.filters = "[{}]";

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer,
                map: map
            });

            spyOn(filterGroupPanel, '_createFilterPanel');
            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_filtersSort').andReturn(layer);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);

            filterGroupPanel._showHideFilters();
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {
        var expectedReturn;

        beforeEach(function() {
            layer = {};
            layer.filters = [
                {type: 'Boolean', label: 'A'},
                {type: 'Date', label: 'B'},
                {type: 'DateRange', label: 'Z'},
                {type: 'Boolean', label: 'E'},
                {type: 'String', label: 'D'}
            ];
            expectedReturn = [
                {type : 'Date', sortOrder : 4, label: 'B'},
                {type : 'DateRange', sortOrder : 3, label: 'Z'},
                {type : 'Boolean', sortOrder : 2, label: 'A'},
                {type : 'Boolean', sortOrder : 2, label: 'E'},
                {type : 'String', sortOrder : 0, label: 'D'}
            ];

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer,
                map: map
            });
        });

        it('sorts by specified order', function() {
            expect(filterGroupPanel._filtersSort(layer.filters)).toEqual(expectedReturn);
        });
    });

    describe('the clear all filters button', function() {

        beforeEach(function() {
            layer = {
                grailsLayerId: 1499409
            };
            layer.isKnownToThePortal = function() { return true };
            filterGroupPanel._isLayerActive = function() {return true};

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer,
                map: map
            });
            filterGroupPanel.layerIsBeingHandled = false;

            spyOn(filterGroupPanel, '_createFilterPanel');
            spyOn(filterGroupPanel, '_clearFilters');
            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, 'addErrorMessage');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
        });


        it('calls the _clearFilters method', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"label":"data_centre","type":"String","name":"data_centre","possibleValues":["ifremer","aoml","csio","kordi","jma","kma","jamstec","incois","bodc","csiro"],"layerId":1499409,"enabled":true}]' });
                }
            );

            filterGroupPanel._initWithLayer();

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
            filterGroupPanel.clearFiltersButton.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });

        it('calls the addErrorMessage function when layer is unknown', function() {

            layer.grailsLayerId = undefined;
            layer.isKnownToThePortal = function(){return false};

            filterGroupPanel._initWithLayer();

            expect(filterGroupPanel.addErrorMessage).toHaveBeenCalled();
        });
    });

    describe('the _showHideFilters function', function() {

        beforeEach(function() {
            layer = {
                grailsLayerId: 1499409
            };
            layer.isKnownToThePortal = function(){return true};
            filterGroupPanel._isLayerActive = function() {return true};

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer,
                map: map
            });

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, 'addErrorMessage');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
        });


        it('calls the addErrorMessage function when filters set but has no filters configured', function() {

            layer.filters = [];

            filterGroupPanel._showHideFilters();

            expect(filterGroupPanel.addErrorMessage).toHaveBeenCalled();
        });

        it('addErrorMessage function not called when filters are configured', function() {

            layer.filters = ["asda","asdasd"];

            filterGroupPanel._showHideFilters();

            expect(filterGroupPanel.addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

        var _mockFilter = function() {

            return {
                handleRemoveFilter: removeFilterSpy
            }
        };

        it('clears all filters', function() {

            filterGroupPanel.filters = [
                _mockFilter('oxygen_sensor'),
                _mockFilter('data_centre'),
                _mockFilter('pi')
            ];

            spyOn(filterGroupPanel, '_updateLayerFilters');

            filterGroupPanel._clearFilters();

            expect(removeFilterSpy.callCount).toBe(3);
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('_updateAndShow', function() {

        beforeEach(function() {

            spyOn(filterGroupPanel.loadingMessage, 'hide');
            spyOn(filterGroupPanel, '_updateLayerFilters');

            filterGroupPanel._updateAndShow();
        });

        it('hides the loading message', function() {
            expect(filterGroupPanel.loadingMessage.hide).toHaveBeenCalled();
        });

        it('calls _updateLayerFilter', function() {

            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('visualise cql', function() {
        describe('_getVisualisationCQLFilters', function() {

            var filterDescriptorData;

            beforeEach(function() {

                filterDescriptorData =  {
                    name: 'test',
                    label: 'some label',
                    cql: "pardon my French",
                    type: 'Boolean',
                    downloadOnly: false
                }
            });

            it('calls getVisualisationCQL when options.downloadOnly is false', function() {

                expect(filterGroupPanel._getVisualisationCQLFilters(filterDescriptorData)).toEqual('pardon my French');
            });

        });
    });

    describe('map', function() {

        it("subscribes to 'spatialconstraintadded' event", function() {

            var geometry = {};

            spyOn(filterGroupPanel, '_updateWithGeometry');
            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(filterGroupPanel._updateWithGeometry).toHaveBeenCalledWith(geometry);
        });

        it("subscribes to 'spatialconstraintcleared' event", function() {

            spyOn(filterGroupPanel, '_updateWithGeometry');
            map.events.triggerEvent('spatialconstraintcleared');
            expect(filterGroupPanel._updateWithGeometry).toHaveBeenCalledWith();
        });
    });

    describe('getCQL', function() {

        it('calls correct method for polygon geometry type', function() {
            filterGroupPanel.geometry = {toWkt: function() { return "[WKT]" }};
            expect(filterGroupPanel.getGeometryCQL()).toBe('INTERSECTS(GEOMTREE,[WKT])');
        });

        it('returns empty string when geometry is falsy', function() {
            filterGroupPanel.geometry = undefined;
            expect(filterGroupPanel.getGeometryCQL()).toEqual(undefined);
        });
    });

    describe('is a real polygon', function() {

        it('returns true when a polygon', function() {
            filterGroupPanel.map.updateSpatialConstraintStyle("polygon");
            expect(filterGroupPanel.isRealPolygon()).toEqual(true);
        });

        it('returns false when not a polygon', function() {
            filterGroupPanel.map.updateSpatialConstraintStyle("bogus");
            expect(filterGroupPanel.isRealPolygon()).toEqual(false);
        });
    });

    it("hasValue() is true if spatial constraint set", function() {
        filterGroupPanel.geometry = "something";
        expect(filterGroupPanel.hasGeometryValue()).toBe(true);
    });

    it("hasValue() is false if spatial constraint unset", function() {
        filterGroupPanel.geometry = undefined;
        expect(filterGroupPanel.hasGeometryValue()).toBe(false);
    });
});
