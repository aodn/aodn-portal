/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterPanel", function() {

    var filterPanel;

    describe('_makePreferredFname()', function() {

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
        });

        it('Should return name + \'.csv\' replacing \':\' with \'#\'', function() {
            filterPanel.layer = {params: {LAYERS: 'imos:argo_float'}};

            var preferredFname = filterPanel._makePreferredFname();

            expect(preferredFname).toEqual('imos#argo_float.csv');
        });
    });

    describe('_makeWfsUrl()', function(){

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
            filterPanel._makeWfsUrlQueryArgs = function() { return {query_args: 'value'} };
        });

        it('Should append query args to url', function() {

            expect(filterPanel._makeWfsUrl('someserver.com/wms', 'layerName')).toEqual('someserver.com/wfs?query_args=value');
        });

        it('Should maintain any existing query string', function() {

            expect(filterPanel._makeWfsUrl('someserver.com/wms?a=b', 'layerName')).toEqual('someserver.com/wfs?a=b&query_args=value');
        });
    });

    describe('_makeWfsUrlQueryArgs()', function(){

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
        });

        it('Should build query_args object with defaults', function() {

            filterPanel.layer = {params: {}};

            var query_args = filterPanel._makeWfsUrlQueryArgs('my_layer');

            expect(query_args.typeName).toEqual('my_layer');
            expect(query_args.SERVICE).toEqual('WFS');
            expect(query_args.outputFormat).toEqual('csv');
            expect(query_args.REQUEST).toEqual('GetFeature');
            expect(query_args.VERSION).toEqual('1.0.0');
            expect(query_args.CQL_FILTER).toEqual(undefined);
        });

        it('Should include CQL if present in params', function() {

            filterPanel.layer = {params: {CQL_FILTER: 'oxygen_sensor = true'}};

            var query_args = filterPanel._makeWfsUrlQueryArgs();

            expect(query_args.CQL_FILTER).toEqual('oxygen_sensor = true');
        });
    });

    describe('responds to expected methods', function() {
        it('has a _clearFilters method', function() {
            expect(filterPanel._clearFilters).toBeDefined();
        });
    });

    describe('the clear all filters button', function() {
        it('calls the _clearFilters method', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"label":"data_centre","type":"String","name":"data_centre","possibleValues":["ifremer","aoml","csio","kordi","jma","kma","jamstec","incois","bodc","csiro"],"layerId":1499409,"enabled":true}]' });
                }
            );

            var target = {};
            var show = jasmine.createSpy('showCallBack');
            var hide = jasmine.createSpy('hideCallBack');

            spyOn(filterPanel, 'createFilter');
            spyOn(filterPanel, '_clearFilters');

            filterPanel.update(
                {
                    grailsLayerId: 1499409
                },
                show,
                hide,
                target
            );

            expect(filterPanel.createFilter).toHaveBeenCalled();
            expect(show).toHaveBeenCalled();
            filterPanel.clearFiltersButton.fireEvent('click');
            expect(filterPanel._clearFilters).toHaveBeenCalled();
        });
    });
});
