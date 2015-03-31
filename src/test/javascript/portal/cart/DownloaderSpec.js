/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.Downloader", function() {

    var downloader;
    var wfsDownloadUrl;
    var generateUrlCallback;

    var collection;
    var params;

    var downloadToken;

    beforeEach(function() {
        downloader = new Portal.cart.Downloader();
        wfsDownloadUrl = 'http://download';
        generateUrlCallback = jasmine.createSpy('generateUrl').andReturn(wfsDownloadUrl);
        downloadToken = 1234;
        downloader._newDownloadToken = function() { return downloadToken; }

        collection = {};
        params = {};
    });

    describe('download', function() {

        beforeEach(function() {
            spyOn(downloader, '_downloadSynchronously');
            spyOn(downloader, '_downloadAsynchronously');
        });

        it('calls generateUrl callback', function() {
            downloader.download(collection, this, generateUrlCallback, params);
            expect(generateUrlCallback).toHaveBeenCalledWith(collection, params);
        });

        it('calls downloadSynchronously for synchronous download', function() {
            downloader.download(collection, this, generateUrlCallback, params);
            expect(downloader._downloadSynchronously).toHaveBeenCalledWith(collection, wfsDownloadUrl, params);
            expect(downloader._downloadAsynchronously).not.toHaveBeenCalled();
        });

        it('calls downloadSynchronously for synchronous download', function() {
            params.asyncDownload = true;
            downloader.download(collection, this, generateUrlCallback, params);
            expect(downloader._downloadSynchronously).not.toHaveBeenCalled();
            expect(downloader._downloadAsynchronously).toHaveBeenCalledWith(collection, wfsDownloadUrl, params);
        });
    });

    describe('status', function() {
        var onRequestedSpy = jasmine.createSpy('onRequested');

        beforeEach(function() {
            spyOn(downloader, 'fireEvent');
            downloader._constructFilename = function() { return 'download.csv'; }
            downloader._openDownload = noOp;
        });

        it("fires 'downloadrequested' event", function() {
            downloader._startDownloadCheckTask = noOp;
            downloader.download(collection, this, generateUrlCallback, params);
            expect(downloader.fireEvent).toHaveBeenCalledWith('downloadrequested', downloadToken);
        });

        it("fires 'downloadstarted' event", function() {
            Ext.TaskMgr.stopAll();
            jasmine.Clock.useMock();
            downloader._startDownloadCheckTask(downloadToken);

            // simulate the server having returned a response, which includes a cookie.
            $.cookie(String.format("downloadToken{0}", downloadToken), downloadToken);
            jasmine.Clock.tick(Portal.cart.Downloader.DOWNLOAD_CHECK_INTERVAL_MS * 2);

            expect(downloader.fireEvent).toHaveBeenCalledWith('downloadstarted', downloadToken);
        });

        // TODO: fail after duration expires.
    });

    describe('downloadAsynchronously', function() {
        it('makes ajax request', function() {
            var wfsDownloadUrl = 'http://someurl';
            var params = { emailAddress: 'tommy@was.here' };

            spyOn(Ext.Ajax, 'request');

            downloader._downloadAsynchronously(collection, wfsDownloadUrl, params);

            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                url: wfsDownloadUrl,
                scope: { params: params },
                success: downloader._onAsyncDownloadRequestSuccess,
                failure: downloader._onAsyncDownloadRequestFailure
            });
        });
    });

    describe('downloadSynchronously', function() {
        var downloadUrl;

        beforeEach(function() {
            downloadUrl = "http://downloadurl";

            spyOn(downloader, '_constructProxyUrl').andReturn(downloadUrl);
            spyOn(downloader, '_openDownload');
        });

        it('constructs download url', function() {
            downloader._downloadSynchronously(collection, wfsDownloadUrl, params);
            expect(downloader._constructProxyUrl).toHaveBeenCalledWith(collection, wfsDownloadUrl, downloadToken, params);
        });

        it('opens download', function() {
            downloader._downloadSynchronously(wfsDownloadUrl, params);
            expect(downloader._openDownload).toHaveBeenCalledWith(downloadUrl);
        });
    });

    describe('constructProxyUrl', function() {
        it('returns URL-endcoded proxy URL', function() {

            var theFilename = 'file name';
            spyOn(downloader, '_sanitiseFilename').andReturn(theFilename);
            spyOn(downloader, '_constructFilename').andReturn(theFilename);

            var expectedProxyUrl =
                String.format(
                    "download?url={0}&downloadFilename={1}&downloadToken={2}&fieldName={3}",
                    'http%3A%2F%2Fdownload',
                    'file%20name',
                    downloadToken,
                    'the%20field'
                );

            var params = {
                downloadControllerArgs: {
                    fieldName: 'the field'
                }
            };

            expect(downloader._constructProxyUrl(collection, wfsDownloadUrl, downloadToken, params)).toBe(expectedProxyUrl);
            expect(downloader._sanitiseFilename).toHaveBeenCalledWith(theFilename);
        });
    });

    describe('_constructFilename', function() {
        it('constructs file name from format and collection title', function() {
            var params = {
                filenameFormat: '{0}_source_files.zip'
            };
            collection.title = 'the title';

            expect(downloader._constructFilename(collection, params)).toBe('the title_source_files.zip');
        });
    });

    describe('_additionalQueryStringFrom', function() {

        it('returns empty string if args is null', function() {
            var returnValue = downloader._additionalQueryStringFrom(null);
            expect(returnValue).toBe('');
        });

        it('returns empty string if no items in args', function() {
            var returnValue = downloader._additionalQueryStringFrom({});
            expect(returnValue).toBe('');
        });

        it("returns additional query string (no '?' required) or elements in args (URL encoded)", function() {
            var returnValue = downloader._additionalQueryStringFrom({ fieldName: 'bob', otherThing: 'this too' });
            expect(returnValue).toBe('&fieldName=bob&otherThing=this%20too');
        });
    });

    describe('sanistiseFilename', function() {

        it('swaps out invalid filname characters (and spaces)', function() {

            var source = 'imos:argo harvest\\/';
            var sourceSanitised = 'imos#argo_harvest__';

            // Duplicate the source before sanitising to ensure global replace (as opposed to first occurrance)
            var sanitiserInput = source + source;
            var expectedOutput = sourceSanitised + sourceSanitised;

            expect(downloader._sanitiseFilename(sanitiserInput)).toBe(expectedOutput);
        });
    });
});
