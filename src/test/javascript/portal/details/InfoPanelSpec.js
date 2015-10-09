describe("Portal.details.InfoPanel", function() {

    var panel;
    var abstractTitle = OpenLayers.i18n('abstractTitle');
    var supplementaryLinksTitle = OpenLayers.i18n('supplementaryLinksTitle');
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
                    get: returns("Abstract & information"),
                    data: {
                        pointOfTruthLink: {
                            href: "http://url",
                            title: "testPointOfTruthLinkTitle"
                        }
                    }
                })
            },
            _getSupplementaryLinks: returns(mockLinks)
        });
    });

    describe('_constructInfoTabHtml', function() {

        it('generates correct HTML', function() {

            var output = panel._constructInfoTabHtml();

            expect(output).toContain(abstractTitle);
            expect(output).toContain("Abstract &amp; information");

            expect(output).toContain(supplementaryLinksTitle);
            expect(output).toContain('href="http://www.google.com"');
            expect(output).toContain(unnamedResourceName);
            expect(output).toContain('href="http://imos.aodn.org.au"');
            expect(output).toContain('Portal');
        });
    });

    describe('_getMetadataLinkAsHtml', function() {

        it('generates correct HTML', function() {

            var output = panel._getMetadataLinkAsHtml();

            expect(output).toContain("testPointOfTruthLinkTitle");
        });
    });
});
