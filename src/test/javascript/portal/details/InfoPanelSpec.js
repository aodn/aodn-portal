/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.InfoPanel", function() {

    var mockInfoPanel;

    beforeEach(function() {

        var mockLinkRecords = [{
            data: {
                href: "http://www.google.com",
                title: ""
            }
        }, {
            data: {
                href: "http://imos.aodn.org.au",
                title: "Portal"
            }
        }];

        mockInfoPanel = new Portal.details.InfoPanel({
            layer: { dataCollection: {
                get: returns({
                    get: returns("Abstract & information")
                }),
                getWebPageLinks: returns(mockLinkRecords)
            }}
        });
    });

    describe('_constructInfoTabHtml', function() {

        it('generates correct HTML', function() {

            // Todo - DN: Write tests
        });
    });
});
