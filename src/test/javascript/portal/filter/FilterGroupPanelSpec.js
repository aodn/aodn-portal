/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterGroupPanel", function() {

    var filterGroupPanel;

    beforeEach(function() {

        filterGroupPanel = new Portal.filter.FilterGroupPanel({});

    });

    describe('responds to expected methods', function() {
        it('has a _clearFilters method', function() {
            expect(filterGroupPanel._clearFilters).toBeDefined();
        });
    });

    describe('_showHideFilters', function() {

        var fnTarget = {};
        var showFunction = function() {};
        var layer;

        beforeEach(function() {
            layer = {};
            layer.filters = "[{}]";

            spyOn(filterGroupPanel, '_createFilterPanel');
            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_filtersSort').andReturn(layer);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);

            filterGroupPanel._showHideFilters(layer, showFunction, noOp, {});
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalledWith(showFunction, fnTarget);
        });
    });

    describe('filter sorting', function() {
        var layer;
        var expectedReturn;

        beforeEach(function() {
            layer = {};
            layer.filters = [
                {type: 'Boolean'},
                {type: 'Date'},
                {type: 'BoundingBox'},
                {type: 'String'}
            ];
            expectedReturn = [
                { type : 'BoundingBox', sortOrder : 2 },
                { type : 'Date', sortOrder : 1 },
                { type : 'Boolean', sortOrder : -1 },
                { type : 'String', sortOrder : -1 }
            ]
        });

        it('sorts by prescribed order', function() {
            expect(filterGroupPanel._filtersSort(layer.filters)).toEqual(expectedReturn);
        });
    });

    describe('the clear all filters button', function() {

        var layer;
        var target;
        var show;
        var hide;

        beforeEach(function() {
            layer = {
                grailsLayerId: 1499409
            };
            layer.isKnownToThePortal = function(){return true};
            filterGroupPanel._isLayerActive = function() {return true};
            target = {};
            show = jasmine.createSpy('showCallBack');
            hide = jasmine.createSpy('hideCallBack');

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

            filterGroupPanel.handleLayer(
                layer,
                show,
                hide,
                target
            );

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
            expect(show).toHaveBeenCalled();
            filterGroupPanel.clearFiltersButton.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });

        it('calls the addErrorMessage function when layer is unknown', function() {

            layer.grailsLayerId = undefined;
            layer.isKnownToThePortal = function(){return false};

            filterGroupPanel.handleLayer(
                layer,
                show,
                hide,
                target
            );

            expect(filterGroupPanel.addErrorMessage).toHaveBeenCalled();
        });
    });

    describe('the _showHideFilters function', function() {

        var layer;
        var target;
        var show;
        var hide;

        beforeEach(function() {
            layer = {
                grailsLayerId: 1499409
            };
            layer.isKnownToThePortal = function(){return true};
            filterGroupPanel._isLayerActive = function() {return true};
            target = {};
            show = jasmine.createSpy('showCallBack');
            hide = jasmine.createSpy('hideCallBack');

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, 'addErrorMessage');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
        });


        it('calls the addErrorMessage function when filters set but has no filters configured', function() {

            layer.filters = [];

            filterGroupPanel._showHideFilters(
                layer,
                show,
                hide,
                target
            );

            expect(filterGroupPanel.addErrorMessage).toHaveBeenCalled();
        });

        it('addErrorMessage function not called when filters are configured', function() {

            layer.filters = ["asda","asdasd"];

            filterGroupPanel._showHideFilters(
                layer,
                show,
                hide,
                target
            );

            expect(filterGroupPanel.addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

        var _mockFilter = function(name) {

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

            filterGroupPanel._updateAndShow(noOp, {});
        });

        it('hides the loading message', function() {

            expect(filterGroupPanel.loadingMessage.hide).toHaveBeenCalled();
        });

        it('calls _updateLayerFilter', function() {

            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('visualise/download cql', function() {
        describe('_getCqlFilter', function() {

            var layer;
            var filterDescriptor;

            beforeEach(function() {
                layer = {
                    getDownloadFilter: function() {
                    }
                };

                filterDescriptor = {
                    name: 'test',
                    label: 'some label',
                    type: 'Boolean'
                }
            });

            it('calls getVisualisationCQL when options.downloadOnly is false', function() {
                filterDescriptor.downloadOnly = false;
                var filterPanel = filterGroupPanel._createFilterPanel(layer, filterDescriptor);
                spyOn(filterPanel, 'getVisualisationCQL');
                spyOn(filterPanel, 'hasValue').andReturn(true);

                filterGroupPanel._getCqlFilter({ downloadOnly: false});

                expect(filterPanel.getVisualisationCQL).toHaveBeenCalled();
            });

            it('calls getDownloadCQL when options.downloadOnly is true', function() {
                filterDescriptor.downloadOnly = true;
                var filterPanel = filterGroupPanel._createFilterPanel(layer, filterDescriptor);
                spyOn(filterPanel, 'getDownloadCQL');
                spyOn(filterPanel, 'hasValue').andReturn(true);

                filterGroupPanel._getCqlFilter({ downloadOnly: true});

                expect(filterPanel.getDownloadCQL).toHaveBeenCalled();
            });
        });
    });
});
