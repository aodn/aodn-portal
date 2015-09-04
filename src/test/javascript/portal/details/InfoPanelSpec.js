/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.InfoPanel", function() {

    var panel;
    var abstractTitle = OpenLayers.i18n('abstractTitle');
    var webpageLinksTitle = OpenLayers.i18n('webpageLinksTitle');
    var unnamedResourceName = OpenLayers.i18n('unnamedResourceName');

    beforeEach(function() {

        var mockLinks = [{
            href: "http://www.google.com",
            title: ""
        }, {
            href: "http://imos.aodn.org.au",
            title: "Portal"
        }];

        panel = new Portal.details.InfoPanel({
            dataCollection: {
                getMetadataRecord: returns({
                    get: returns("Abstract & information")
                })
            },
            _getWebpageLinks: returns(mockLinks)
        });
    });

    describe('_constructInfoTabHtml', function() {

        it('generates correct HTML', function() {

            var output = panel._constructInfoTabHtml();

            expect(output).toContain(abstractTitle);
            expect(output).toContain("Abstract &amp; information");

            expect(output).toContain(webpageLinksTitle);
            expect(output).toContain('href="http://www.google.com"');
            expect(output).toContain(unnamedResourceName);
            expect(output).toContain('href="http://imos.aodn.org.au"');
            expect(output).toContain('Portal');
        });
    });
});
