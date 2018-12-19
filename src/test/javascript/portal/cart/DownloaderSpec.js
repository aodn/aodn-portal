describe("Portal.cart.Downloader", function() {

    var downloader;
    var wfsDownloadUrl;
    var generateUrlCallback;

    var collection;
    var params;

    var downloadToken;
    var goodResponse;
    var badResponse;

    beforeEach(function() {
        downloader = new Portal.cart.Downloader();
        downloader.messageBox = {show: noOp};
        wfsDownloadUrl = 'http://download';
        generateUrlCallback = jasmine.createSpy('generateUrl').andReturn(wfsDownloadUrl);
        downloadToken = 1234;
        downloader._newDownloadToken = returns(downloadToken);

        collection = {};
        params = {};

        goodResponse = {
            status: 200,
            responseText: JSON.stringify({
                url: "http://asyncdownloads.aodn.org.au"
            })
        };

        badResponse = {
            status: 404,
            responseText: JSON.stringify("this has gone bad")
        };
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

    describe('downloadAsynchronously', function() {
        it('makes ajax request', function() {
            var wfsDownloadUrl = 'http://someurl';
            var params = {};

            spyOn(Ext.Msg, 'show');
            spyOn(Ext.Ajax, 'request');

            downloader._downloadAsynchronously(collection, wfsDownloadUrl, params);

            expect(Ext.Ajax.request).toHaveBeenCalled();
            var requestArgs = Ext.Ajax.request.calls[0].args[0];

            expect(requestArgs.url).toEqual(wfsDownloadUrl);
            expect(requestArgs.scope).toEqual(downloader);

            spyOn(downloader, '_onAsyncDownloadRequestSuccess');
            requestArgs.success.call(downloader, goodResponse, params);
            expect(downloader._onAsyncDownloadRequestSuccess).toHaveBeenCalledWith(goodResponse, params);

            spyOn(downloader, '_onAsyncDownloadRequestFailure');
            requestArgs.failure.call(downloader, badResponse, params);
            expect(downloader._onAsyncDownloadRequestFailure).toHaveBeenCalled();

        });

        describe('_onAsyncDownloadRequestSuccess', function() {
            it('calls serviceResponseHandler', function() {

                params = {
                    emailAddress: "emailAddress",
                    serviceResponseHandler: returns()
                };
                spyOn(params, "serviceResponseHandler");
                downloader.checkResponse(goodResponse, params);

                expect(params.serviceResponseHandler).toHaveBeenCalledWith(goodResponse);
            });

            it('return response serviceResponseHandler is undefined', function() {
                expect(downloader._getServiceMessage(undefined, goodResponse)).toEqual(goodResponse);
            });
        });
    });

    describe('downloadSynchronously', function() {
        var downloadUrl;

        beforeEach(function() {
            downloadUrl = "http://downloadurl";
            spyOn(Ext.Msg, 'show');
            spyOn(downloader, '_constructProxyUrl').andReturn(downloadUrl);
            spyOn($, 'fileDownload');
        });

        it('constructs download url', function() {
            downloader._downloadSynchronously(collection, wfsDownloadUrl, params);
            expect(downloader._constructProxyUrl).toHaveBeenCalledWith(collection, wfsDownloadUrl, downloadToken, params);
        });

        it('delegates to jquery.fileDownload', function() {
            downloader._downloadSynchronously(wfsDownloadUrl, params);
            expect($.fileDownload).toHaveBeenCalled();
            expect($.fileDownload.calls[0].args[0]).toBe(downloadUrl);

            var fileDownloadOptions = $.fileDownload.calls[0].args[1];
            expect(fileDownloadOptions.cookieName).toBe(String.format("downloadToken{0}", downloadToken));
            expect(fileDownloadOptions.cookieValue).toBe(downloadToken);
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
            collection.getTitle = returns('the title');

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

    describe('events', function() {
        var downloadUrl = 'some download url';
        beforeEach(function() {
            spyOn(downloader, 'fireEvent');
        });

        describe('synchronous download', function() {
            var collection;

            beforeEach(function() {
                collection = {};
            });

            it('fires downloadrequested', function() {
                downloader._onPrepare(downloadUrl, collection);
                expect(collection.downloadStatus).toBe('requested');
                expect(downloader.fireEvent).toHaveBeenCalledWith('downloadrequested', downloadUrl, collection);
            });

            it('fires downloadstarted', function() {
                downloader._onSuccess(downloadUrl, collection);
                expect(collection.downloadStatus).toBe('started');
                expect(downloader.fireEvent).toHaveBeenCalledWith('downloadstarted', downloadUrl, collection);
            });

            it('fires downloadfailed', function() {
                downloader._onFailure(downloadUrl, collection, 'error');
                expect(collection.downloadStatus).toBe('failed');
                expect(downloader.fireEvent).toHaveBeenCalledWith('downloadfailed', downloadUrl, collection, 'error');
            });
        });
    })
});
