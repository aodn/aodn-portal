/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterPanel", function() {

    var filterPanel;

    // Test set-up
    beforeEach(function() {
        filterPanel = new Portal.filter.FilterPanel({});
    });

    it('_make_preferredFname should return name + \'.csv\' replacing \':\' with \'#\'', function() {
        filterPanel.layer = {params: {LAYERS: 'imos:argo_float'}};
        
        var preferredFname = filterPanel._makePreferredFname();
        
        expect(preferredFname).toEqual('imos#argo_float.csv');
    });
});
