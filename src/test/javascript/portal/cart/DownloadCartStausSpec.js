/*
* Copyright 2012 IMOS
*
* The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
*
*/

describe("Portal.cart.DownloadCartStatus", function() {

    it('removeDownloadCartRecord', function() {


        spyOn(Ext.Ajax, 'request').andCallFake(function() {return true});

        removeDownloadCartRecord("blarg");

        var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
        expect(ajaxParams.url).toBe('downloadCart/removeRecord');
        expect(ajaxParams.params.rec_uuid).toBe('blarg');
        expect(ajaxParams.success).toBe(_handleSuccessAndShow)
        expect(ajaxParams.failure).toBe(_handleFailureAndShow)
    });
});