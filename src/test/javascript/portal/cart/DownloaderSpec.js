/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.Downloader", function() {

    var downloader;
    var wfsDownloadUrl
    var generateUrlCallback

    var collection;
    var params;

    beforeEach(function() {
        downloader = new Portal.cart.Downloader();
        wfsDownloadUrl = 'http://download'
        generateUrlCallback = jasmine.createSpy('generateUrl').andReturn(wfsDownloadUrl);

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
            params.asyncDownload = true
            downloader.download(collection, this, generateUrlCallback, params);
            expect(downloader._downloadSynchronously).not.toHaveBeenCalled();
            expect(downloader._downloadAsynchronously).toHaveBeenCalledWith(collection, wfsDownloadUrl, params);
        });
    });

    describe('downloadAsynchronously', function() {
        it('makes ajax request', function() {
            var wfsDownloadUrl = 'http://someurl';
            var params = { emailAddress: 'tommy@was.here' };

            spyOn(Ext.Ajax, 'request');

            downloader._downloadAsynchronously(collection, wfsDownloadUrl, params);

            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                url: wfsDownloadUrl,
                scope: downloader,
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
            expect(downloader._constructProxyUrl).toHaveBeenCalledWith(collection, wfsDownloadUrl, params);
        });

        it('opens download', function() {
            downloader._downloadSynchronously(wfsDownloadUrl, params);
            expect(downloader._openDownload).toHaveBeenCalledWith(downloadUrl);
        });
    });

    describe('constructProxyUrl', function() {
        it('returns URL-endcoded proxy URL', function() {

            var theFileName = 'file name';
            spyOn(downloader, '_sanitiseFileName').andReturn(theFileName);
            spyOn(downloader, '_constructFileName').andReturn(theFileName);

            var expectedProxyUrl = "download?url=http%3A%2F%2Fdownload&downloadFilename=file%20name&fieldName=the%20field";
            var params = {
                downloadControllerArgs: {
                    fieldName: 'the field'
                }
            };

            expect(downloader._constructProxyUrl(collection, wfsDownloadUrl, params)).toBe(expectedProxyUrl);
            expect(downloader._sanitiseFileName).toHaveBeenCalledWith(theFileName);
        });
    });

    describe('_constructFileName', function() {
        it('constructs file name from format and collection title', function() {
            var params = {
                fileNameFormat: '{0}_source_files.zip'
            }
            collection.title = 'the title';

            expect(downloader._constructFileName(collection, params)).toBe('the title_source_files.zip');
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

    describe('sanistiseFileName', function() {

        it('swaps out invalid filname characters (and spaces)', function() {

            var source = 'imos:argo harvest\\/';
            var sourceSanitised = 'imos#argo_harvest__';

            // Duplicate the source before sanitising to ensure global replace (as opposed to first occurrance)
            var sanitiserInput = source + source;
            var expectedOutput = sourceSanitised + sourceSanitised;

            expect(downloader._sanitiseFileName(sanitiserInput)).toBe(expectedOutput);
        });
    });
});
