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
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedDlFailedMsg') + '</div><div class="clear"></div>');
        });

        it('_generateTimeoutHtmlString formats correctly', function() {
            var mockHtml = estimator._generateTimeoutHtmlString();
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedDlTimeoutMsg') + ' <img src="images/error.png"></div><div class="clear"></div>')
        });

        it('_generateEstHtmlString formats correctly when size is greater than 1024MB', function() {
            mockEstimate = 1153433600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedDlMessage') + ' 1.1GB <img src="images/error.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is greater than 512MB and less than 1024MB', function() {
            mockEstimate = 629145600;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedDlMessage') + ' 600.0MB <img src="images/error.png"></div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is less than 512', function() {
            mockEstimate = 419430400;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedDlMessage') + ' 400.0MB </div><div class="clear"></div>');
        });

        it('_generateEstHtmlString formats correctly when size is 0', function() {
            mockEstimate = 0;
            var mockHtml = estimator._generateEstHtmlString(mockEstimate);
            expect(mockHtml).toEqual('<div>' + OpenLayers.i18n('estimatedNoDataMsg') + '  </div><div class="clear"></div>');
        });
    });

    describe('creates a unique html element per download view request', function() {
        it('responds to getIdElementName', function() {
            expect(estimator.getIdElementName).toBeDefined();
        });

        it('defines getIdElementName as a function', function() {
            expect(typeof(estimator.getIdElementName)).toEqual('function');
        });

        it('creates a unique id element name for each estimator for a uuid', function() {
            var otherEstimator = new Portal.cart.DownloadEstimator({ initTimestampString: '0' });
            expect(estimator.getIdElementName('1')).not.toEqual(otherEstimator.getIdElementName('1'));
        });
    });

    describe('human readable filesize', function() {
        it('gives correct units', function() {
            // Fix for #1162 is covered by the value 36020 below, which was originally being displayed
            // as "0.0MB" but is now displayed as "35.2kB".
            var valsInBytes = [100, 1024, 36020, 11.1 * 1024 * 1024, 12.34 * 1024 * 1024 * 1024];
            var expectedHumanReadableStrings = ['100B', '1.0kB', '35.2kB', '11.1MB', '12.3GB'];

            for (var i = 0; i < valsInBytes.length; i++) {
                expect(estimator._humanReadableFileSize(valsInBytes[i])).toEqual(expectedHumanReadableStrings[i]);
            }
        });
    });
});
