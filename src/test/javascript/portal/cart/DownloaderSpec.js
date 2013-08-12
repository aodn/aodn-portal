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
        it('start makes call to server', function() {
            spyOn(Ext.Ajax, 'request');
            downloader.start();
            expect(Ext.Ajax.request).toHaveBeenCalled();
        });

        describe('request params', function() {

            var request;

            beforeEach(function() {
                spyOn(Ext.Ajax, 'request');
                downloader.start();
                request = Ext.Ajax.request.mostRecentCall.args[0];
            });

            it('url', function() {
                expect(request.url).toBe('downloadCart/download');
            });

            it('success', function() {
                expect(request.success).toBeTruthy();
                expect(request.success).toBe(downloader._onDownloadSuccess);
            });

            it('failure', function() {
                expect(request.failure).toBeTruthy();
                expect(request.failure).toBe(downloader._onDownloadFailure);
            });
        });

        describe('is downloading', function() {
            it('initially false', function() {
                expect(downloader.isDownloading()).toBe(false);
            });

            it('true when download starts', function() {
                downloader.start();
                expect(downloader.isDownloading()).toBe(true);
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
