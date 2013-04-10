
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownLoadList", function() {

    it('on cart Changed event', function() {
        spyOn(Ext.data.Store.prototype,'load').andCallFake(function() {return true});

        var downloadList = new Portal.cart.DownloadList({});

        Ext.data.Store.prototype.load.reset(); //reset the spy

        Ext.MsgBus.publish('downloadCart.cartContentsUpdated');

        expect(downloadList.downloadItemsStore.load).toHaveBeenCalled();
    });
});