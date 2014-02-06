/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.DownloadEstimator', function() {

    var estimator;
    var geoNetworkRecord;

    beforeEach(function() {
        estimator = new Portal.cart.DownloadEstimator();
        geoNetworkRecord = {
            uuid: 9
        };
    });

    describe('behavior on timeout', function() {
        it('_createFailMessage calls _generateFailureResponse', function() {
            var mockResult = {
                isTimeout: true,
                statusText: 'transaction aborted',
                status: -1
            };

            spyOn(estimator, '_generateFailureResponse');
            estimator._createFailMessage(mockResult, geoNetworkRecord.uuid);
            expect(estimator._generateFailureResponse).toHaveBeenCalled();
        });

        it('_generateFailureResponse generates correct response on timeout', function() {
            var mockResult = {
                isTimeout: true,
                statusText: 'transaction aborted',
                status: -1
            };

            expect(estimator._generateFailureResponse(mockResult)).toEqual('transaction aborted');
        });

        it('_generateFailureResponse generates correct response on other failure', function() {
            var mockResult = {
                statusText: 'transaction aborted',
                status: -1
            };

            expect(estimator._generateFailureResponse(mockResult)).toEqual(-1);
        });
    });

    describe('download size estimate formatting', function() {
        var mockEstimate;

        it('_generateFailHtmlString formats correctly', function() {
            var mockHtml = estimator._generateFailHtmlString();
            expect(mockHtml).toEqual('<div>The estimated NetCDF size is unknown.</div><div class="clear"></div>');
        });

        it('_generateTimeoutHtmlString formats correctly', function() {
            var mockHtml = estimator._generateTimeoutHtmlString();
            expect(mockHtml).toEqual('<div>The NetCDF size is too large to estimate. <img src="images/error.png"></div><div class="clear"></div>')
        });

        it('_generateEstHtmlString formats correctly when size is greater than 1024MB', function() {
            mockEstimate = 1153433600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated NetCDF size is  1.1GB <img src="images/error.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is greater than 512MB and less than 1024MB', function() {
            mockEstimate = 629145600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated NetCDF size is  600.0MB <img src="images/error.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is less than 512', function() {
            mockEstimate = 419430400;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated NetCDF size is  400.0MB </div><div class="clear"></div>');
        });
    });
});
