/*
* Copyright 2012 IMOS
*
* The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
*
*/

describe("Portal.cart.DownloadCartStatus", function() {

    it('setDownloadCartRecordDisableFlag', function() {


        spyOn(Ext.Ajax, 'request').andCallFake(function() {return true});

        setDownloadCartRecordDisableFlag("blarg","true");

        var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
        expect(ajaxParams.url).toBe('downloadCart/modifyRecordAvailability');
        expect(ajaxParams.params.rec_uuid).toBe('blarg');
        expect(ajaxParams.params.disableFlag).toBe("true");
        expect(ajaxParams.success).toBe(_handleSuccess);
        expect(ajaxParams.failure).toBe(_handleFailureAndShow);
    });
});