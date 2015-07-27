/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.InfoPanel", function() {

    var mockInfoPanel;
    var mockLinkObjects;

    beforeEach(function() {

        mockInfoPanel = new Portal.details.InfoPanel({
            layer: { dataCollection: {
                get: function() { return {
                    get: function() {
                        return "Abstract & information";
                    }
                }}
            }}
        });

        mockLinkObjects = [{
            href: "http://www.google.com",
            title: ""
        }, {
            href: "http://imos.aodn.org.au",
            title: "Portal"
        }];
    });

    describe('_constructInfoTabHtml', function() {

        it('generates correct HTML', function() {

            // Todo - DN: Write tests
        });
    });
});

