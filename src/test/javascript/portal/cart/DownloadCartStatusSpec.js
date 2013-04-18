/*
* Copyright 2012 IMOS
*
* The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
*
*/

describe("Portal.cart.DownloadCartStatus", function() {

    it('setDownloadCartRecordDisableFlag', function() {


        spyOn(Ext.Ajax, 'request').andCallFake(function() {return true});

        setDownloadCartRecordDisableFlag("blarg","flag");

        var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
        expect(ajaxParams.url).toBe('downloadCart/modRecordAvailability');
        expect(ajaxParams.params.rec_uuid).toBe('blarg');
        expect(ajaxParams.success).toBe(getDownloadCartCount)
        expect(ajaxParams.failure).toBe(_handleFailureAndShow)
    });
});