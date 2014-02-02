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
    });

    describe('download size estimate', function() {
        var mockEstimate;

        it('_generateFailHtmlString formats correctly', function() {
            var mockHtml = estimator._generateFailHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>The estimated download size is unknown.</div><div class="clear"></div>');
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
