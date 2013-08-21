/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.Downloader", function() {

    var downloader;

    beforeEach(function() {
        downloader = new Portal.cart.Downloader({
            store: Portal.data.ActiveGeoNetworkRecordStore.instance()
        });
    });

    describe('download', function() {

        beforeEach(function() {
            spyOn(Portal.utils.FormUtil, 'createAndSubmit');
        });

        it('start makes call to form util create and submit', function() {
            downloader.start();
            expect(Portal.utils.FormUtil.createAndSubmit).toHaveBeenCalled();
        });

        describe('request params', function() {

            beforeEach(function() {
                downloader.start();
            });

            it('include expected path', function() {
                expect(Portal.utils.FormUtil.createAndSubmit.mostRecentCall.args[0]).toBe('downloadCart/download');
            });

            it('include expected params', function() {
                var params = Portal.utils.FormUtil.createAndSubmit.mostRecentCall.args[1];
                expect(params.items).toEqual(downloader.store.getItemsEncodedAsJson());
            });
        });

        describe('is downloading', function() {
            it('initially false', function() {
                expect(downloader.isDownloading()).toBe(false);
            });

            it('false when download succeeds', function() {
                downloader.start();
                downloader._onDownloadSuccess();
                expect(downloader.isDownloading()).toBe(false);
            });

            it('false when download fails', function() {
                downloader.start();
                downloader._onDownloadFailure();
                expect(downloader.isDownloading()).toBe(false);
            });
        });
    });
});
