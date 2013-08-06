/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterPanel", function() {

    var filterPanel;

    describe('_sanitiseLayerNameForFilename()', function() {

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
        });

        it('Should return name replacing \':\' with \'#\'', function() {
            filterPanel.layer = {params: {LAYERS: 'imos:argo_float'}};

            var safeName = filterPanel._sanitiseLayerNameForFilename();

            expect(safeName).toEqual('imos#argo_float');
        });
    });

    describe('_makeDownloadCartItem()', function() {

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
        });

        it('Should create an item with the correct fields', function() {

            var item = filterPanel._makeDownloadCartItem(
                'record uuid',
                'record title',
                'title',
                'href',
                'type',
                'protocol',
                'filename'
            );

            expect(item.record.data.uuid).toEqual('record uuid');
            expect(item.record.data.title).toEqual('record title');

            expect(item.link.title).toEqual('title');
            expect(item.link.href).toEqual('href');
            expect(item.link.type).toEqual('type');
            expect(item.link.protocol).toEqual('protocol');
            expect(item.link.preferredFname).toEqual('filename');
        });
    });

    describe('_dataDownloadItem()', function() {

        it('Should call _makeDownloadCartItem() with correct parameters', function() {

            filterPanel = new Portal.filter.FilterPanel({});
            filterPanel.layer = {
                name: 'layerName',
                params: {LAYERS: 'imos:argo_float'},
                getMetadataUrl: function() { return "metadataUrl" }
            };
            spyOn(filterPanel, '_makeDownloadCartItem');
            spyOn(filterPanel, '_makeDataDownloadURL').andReturn('downloadUrl');
            spyOn(filterPanel, '_sanitiseLayerNameForFilename').andReturn('filename');

            filterPanel._dataDownloadItem();

            expect(filterPanel._makeDownloadCartItem).toHaveBeenCalledWith(
                'metadataUrl',
                'layerName',
                'Filtered layerName data',
                'downloadUrl',
                'text/csv',
                'WWW:DOWNLOAD-1.0-http--downloaddata',
                'filename.csv'
            );
            expect(filterPanel._makeDataDownloadURL).toHaveBeenCalled();
            expect(filterPanel._sanitiseLayerNameForFilename).toHaveBeenCalled();
        });
    });

    describe('_metadataItem()', function() {

        it('Should call _makeDownloadCartItem() with correct parameters', function() {

            filterPanel = new Portal.filter.FilterPanel({});
            filterPanel.layer = {
                name: 'layerName',
                params: {LAYERS: 'imos:argo_float'},
                getMetadataUrl: function() { return "metadataUrl" }
            };
            spyOn(filterPanel, '_makeDownloadCartItem');
            spyOn(filterPanel, '_sanitiseLayerNameForFilename').andReturn('filename');

            filterPanel._metadataItem();

            expect(filterPanel._makeDownloadCartItem).toHaveBeenCalledWith(
                'metadataUrl',
                'layerName',
                'layerName metadata',
                'metadataUrl',
                'application/xml',
                'WWW:LINK-1.0-http--link',
                'filename_metadata.xml'
            );
            expect(filterPanel._sanitiseLayerNameForFilename).toHaveBeenCalled();
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
