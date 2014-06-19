/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.WfsDownloadHandler', function () {

    describe('getDownloadOption', function() {

        it('should return a download handler when require info is present', function() {

            var testResource = {name: 'layer_name'};
            var handler = new Portal.cart.WfsDownloadHandler(testResource);
            var downloadOptions =  handler.getDownloadOptions();
            var downloadOption = downloadOptions[0];

            expect(downloadOptions.length).toBe(1);

            expect(downloadOption.textKey).not.toBeNull();
            expect(downloadOption.textKey).not.toBe('');
            expect(downloadOption.handler).not.toBeNull();
            expect(downloadOption.handlerParams).not.toBeNull();
        });

        it('should not return any otherwise', function() {

            var testResource = {/* empty */};
            var handler = new Portal.cart.WfsDownloadHandler(testResource);
            var downloadOptions =  handler.getDownloadOptions();

            expect(downloadOptions.length).toBe(0);
        });
    });
});