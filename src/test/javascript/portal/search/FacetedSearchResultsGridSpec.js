
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResultsGrid", function() {

    var fsrg;
    var testTarget;
    var testLayerLink;

    setViewPortTab = jasmine.createSpy();

    beforeEach(function() {

        fsrg = new Portal.search.FacetedSearchResultsGrid();

        // Test data
        testTarget = {};
        testLayerLink = {};

        // Add spies
        spyOn(Ext.MsgBus, 'publish');
    });

    it('should publish when a layer link is returned', function() {
        spyOn(fsrg, '_getLayerLink').andReturn(testLayerLink);
        fsrg._viewButtonOnClick(null, testTarget);

        expect(Ext.MsgBus.publish).toHaveBeenCalledWith('addLayerUsingLayerLink', testLayerLink);
    });

    it('should not publish when undefined is returned as a layer link', function() {
        spyOn(fsrg, '_getLayerLink').andReturn(undefined);
        fsrg._viewButtonOnClick(null, testTarget);

        expect(Ext.MsgBus.publish).not.toHaveBeenCalled();
    });
});