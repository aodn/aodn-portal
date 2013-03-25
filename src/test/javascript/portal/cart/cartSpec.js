
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownLoadList", function() {



    it('on cart Changed event', function() {
        var downloadList = new Portal.cart.DownloadList({});
        spyOn(downloadList.downloadItemsStore,'load');

        Ext.MsgBus.publish('downloadCart.cartContentsUpdated');

        expect(downloadList.downloadItemsStore.load).toHaveBeenCalled();
    });

});