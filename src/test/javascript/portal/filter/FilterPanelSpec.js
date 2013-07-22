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

    describe('_makeWFSURL()', function(){

        beforeEach(function() {
            filterPanel = new Portal.filter.FilterPanel({});
        });

        it('Shouldn\'t inlude CQL if not in params', function() {

            filterPanel.layer = {params: {}};

            expect(filterPanel._makeWFSURL('someserver.com/wms?a=b', 'layerName')).toEqual('someserver.com/wfs?a=b&typeName=layerName&SERVICE=WFS&outputFormat=csv&REQUEST=GetFeature&VERSION=1.0.0');
        });

        it('Should inlude CQL if present in params', function() {

            filterPanel.layer = {params: {CQL_FILTER: 'oxygen_sensor = true'}};

            expect(filterPanel._makeWFSURL('someserver.com/wms', 'layerName')).toEqual('someserver.com/wfs?typeName=layerName&SERVICE=WFS&outputFormat=csv&REQUEST=GetFeature&VERSION=1.0.0&CQL_FILTER=oxygen_sensor%20%3D%20true');
        });
    });
});
