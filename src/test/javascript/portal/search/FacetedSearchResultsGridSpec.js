
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

    it('shouldn\'t publish when false is returned', function() {

        spyOn(fsrg.getView(), 'findRowIndex').andReturn(false);

        fsrg.onClick(null, testTarget);

        expect(Ext.MsgBus.publish).not.toHaveBeenCalled();
    });

    /**
     *110,-50,160,-3
     * 127.3187,-13.9376,130.0641,-12.4581
     *  <geoBox>130.0641|-12.4581|130.0641|-12.4581</geoBox>
     <geoBox>127.3187|-13.9376|127.3187|-13.9376</geoBox>
     <geoBox>126.8229|-13.6200|126.8229|-13.6200</geoBox>
     <geoBox>126.7466|-13.9208|126.7466|-13.9208</geoBox>
     <geoBox>126.2571|-14.1286|126.2571|-14.1286</geoBox>
     <geoBox>124.8530|-14.7661|124.8530|-14.7661</geoBox>
     <geoBox>124.9932|-15.0937|124.9932|-15.0937</geoBox>
     <geoBox>125.1537|-15.5042|125.1537|-15.5042</geoBox>
     <geoBox>124.5223|-15.4642|124.5223|-15.4642</geoBox>
     <geoBox>124.4767|-16.3713|124.4767|-16.3713</geoBox>
     <geoBox>124.5375|-16.3486|124.5375|-16.3486</geoBox>
     <geoBox>123.7070|-15.9509|123.7070|-15.9509</geoBox>
     <geoBox>123.7069|-15.9524|123.7069|-15.9524</geoBox>
     */
});