
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanel", function() {
    var downloadDataView;

    beforeEach(function() {
        downloadPanel = new Portal.cart.DownloadPanel();
    });

    // it('on cart Changed event', function() {
    //     spyOn(Ext.data.Store.prototype,'load').andCallFake(function() {return true});

    //     var downloadPanel = new Portal.cart.DownloadPanel({});

    //     Ext.data.Store.prototype.load.reset(); //reset the spy

    //     Ext.MsgBus.publish('downloadCart.cartContentsUpdated');

    //     expect(downloadPanel.downloadItemsStore.load).toHaveBeenCalled();
    // });

    describe('ActiveGeoNetworkRecordStore interaction', function() {
        it('store is the ActiveGeoNetworkRecordStore singleton instance', function() {
            expect(downloadPanel.store).toBe(Portal.data.ActiveGeoNetworkRecordStore.instance());
        });
    });

    describe('initialisation', function() {
        it('column model', function() {
            expect(downloadPanel.colModel).toBeInstanceOf(Portal.cart.DownloadColumnModel);
        });

        it('view', function() {
            expect(downloadPanel.view).toBeInstanceOf(Portal.cart.DownloadGridView);
        });
    });
});
