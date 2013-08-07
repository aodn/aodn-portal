/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadList", function() {

    Portal.app = {
        config: {
            'downloadCartMimeTypeToExtensionMapping': {
                'text/csv': 'csv'
            }
        }
    };

    var downloadList = new Portal.cart.DownloadList({});

    describe('getFileTypeInfo()', function() {

        it('Should get the correct file extension for a mime type', function() {

            spyOn(downloadList, 'extensionForMimeType').andReturn('extension');

            var returnedValue = downloadList.getFileTypeInfo('text/csv');

            expect(returnedValue).toBe(' (.extension)');
        });

        it('Should return an empty String when the mime type is unknown', function() {

            spyOn(downloadList, 'extensionForMimeType').andReturn(undefined);

            var returnedValue = downloadList.getFileTypeInfo('text/something_unknown');

            expect(returnedValue).toBe('');
        });
    });

    describe('extensionForMimeType()', function() {

        it('Should get the correct file extension for a mime type', function() {

            var returnedValue = downloadList.extensionForMimeType('text/csv');

            expect(returnedValue).toBe('csv');
        });

        it('Should return undefined if file type is not known', function() {

            var returnedValue = downloadList.extensionForMimeType('text/something_unknown');

            expect(returnedValue).toBe(undefined);
        });
    });
});
