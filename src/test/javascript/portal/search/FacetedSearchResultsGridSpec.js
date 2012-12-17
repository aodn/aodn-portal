
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

    beforeEach(function() {

        fsrg = new Portal.search.FacetedSearchResultsGrid();

        // Test data
        testTarget = {};
        testLayerLink = {};

        // Add spies
        spyOn(Ext.MsgBus, 'publish');
        spyOn(fsrg.getView(), 'findRow').andCallFake(function(e, target) {

            expect(target).not.toBe(testTarget);
        });
        spyOn(fsrg, '_getLayerLink').andReturn(testLayerLink);
    });

    it('should publish when 0 is returned', function() {

        spyOn(fsrg.getView(), 'findRowIndex').andReturn(0);

        fsrg.onClick(null, testTarget);

        expect(Ext.MsgBus.publish).toHaveBeenCalledWith('addLayerUsingLayerLink', testLayerLink);
    });

    it('should publish when 10 is returned', function() {

        spyOn(fsrg.getView(), 'findRowIndex').andReturn(10);

        fsrg.onClick(null, testTarget);

        expect(Ext.MsgBus.publish).toHaveBeenCalledWith('addLayerUsingLayerLink', testLayerLink);
    });

    it('should publish when false is returned', function() {

        spyOn(fsrg.getView(), 'findRowIndex').andReturn(false);

        fsrg.onClick(null, testTarget);

        expect(Ext.MsgBus.publish).not.toHaveBeenCalled();
    });
});