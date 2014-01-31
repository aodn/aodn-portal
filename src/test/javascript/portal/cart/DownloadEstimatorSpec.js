/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.DownloadEstimator', function() {

    var estimator;
    var geoNetworkRecord;
    var mockResult;

    beforeEach(function() {
        estimator = new Portal.cart.DownloadEstimator();
        geoNetworkRecord = {
            uuid: 9
        };
        mockResult = {
            statusText: 'transaction aborted',
            status: -1
        };
    });

    describe('behavior on timeout', function() {
        it('_createFailMessage calls _generateFailureResponse', function() {
            spyOn(estimator, '_generateFailureResponse');
            estimator._createFailMessage(mockResult, geoNetworkRecord.uuid);
            expect(estimator._generateFailureResponse).toHaveBeenCalled();
        });

        it('_generateFailureResponse generates correct response on timeout', function() {
            mockResult = {
        	    isTimeout: true	
            };

            var mockResp = estimator._generateFailureResponse(mockResult);
            expect(mockResp).toEqual('transaction aborted');
        });

        it('_generateFailureResponse generates correct response on other failure', function() {
            var mockResp = estimator._generateFailureResponse(mockResult);
            expect(mockResp).toEqual(-1);
        });
    });

    describe('download size estimate formatting', function() {
        var mockEstimate;

        it('_generateFailHtmlString formats correctly', function() {
            var mockHtml = estimator._generateFailHtmlString();
            expect(mockHtml).toEqual('<div>The estimated download size is unknown.</div><div class="clear"></div>');
        });
        
        it('_generateTimeoutHtmlString formats correctly', function() {
            var mockHtml = estimator._generateTimeoutHtmlString();
            expect(mockHtml).toEqual('<div>The download size is too large to estimate. <img src="images/clock_red.png"></div><div class="clear"></div>')
        });

        it('_generateEstHtmlString formats correctly when size is greater than 1024MB', function() {
            mockEstimate = 1153433600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  1.1GB <img src="images/clock_red.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is greater than 512MB and less than 1024MB', function() {
            mockEstimate = 629145600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  600.0MB <img src="images/clock_red.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is less than 512', function() {
            mockEstimate = 419430400;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is  400.0MB </div><div class="clear"></div>');
        });
    });
});
