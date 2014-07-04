/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.AodaacDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.AodaacDownloadHandler({
            name: 131 // An AODAAC Product ID
        });
    });

    describe('getDownloadOptions', function() {

        it('has one valid option', function() {

            var options = handler.getDownloadOptions();

            expect(options.length).toBe(1);

            var option = options[0];

//            expect(options.textKey).not.toBeUnde // TODO - DN: Continue here
        });

        it('has no options when missing required information', function() {

            handler.onlineResource.name = "";

            var options = handler.getDownloadOptions();
        });
    });
});
