
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadDataView", function() {

    it('on cart Changed event', function() {
        spyOn(Ext.data.Store.prototype,'load').andCallFake(function() {return true});

        var downloadDataView = new Portal.cart.DownloadDataView({});

        Ext.data.Store.prototype.load.reset(); //reset the spy

        Ext.MsgBus.publish('downloadCart.cartContentsUpdated');

        expect(downloadDataView.downloadItemsStore.load).toHaveBeenCalled();
    });
});
