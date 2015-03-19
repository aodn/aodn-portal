/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.InfoPanel", function() {

    var mockInfoPanel;
    var mockAbstract;
    var mockLinkObjects;

    beforeEach(function() {

        mockInfoPanel = new Portal.details.InfoPanel({
            layer: new OpenLayers.Layer.WMS()
        });

        mockAbstract = "Abstract information";

        mockLinkObjects = [{
            href: "/",
            title: ""
        }];

        mockInfoPanel.update = jasmine.createSpy('update').andCallFake(function(html) { mockInfoPanel.html = html });
    });

    describe('_constructInfoTabHtml', function() {
        it('generates an error response if response text is null', function() {
            mockInfoPanel._constructInfoTabHtml(null, mockLinkObjects);

            expect(mockInfoPanel.update.callCount).toBe(1);
            expect(mockInfoPanel.html).toEqual(mockInfoPanel._getHtmlHeader("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>") + '<li><a  href=/ target="_blank"><i>Unnamed Resource</i></a></li>\n</ul>');
        })

        it('generates an internal link with with unnamed resource if href and title are empty', function() {
            mockInfoPanel._constructInfoTabHtml(mockAbstract, mockLinkObjects);

            expect(mockInfoPanel.update.callCount).toBe(1);
            expect(mockInfoPanel.html).toEqual(mockInfoPanel._getHtmlHeader(mockAbstract) + '<li><a  href=/ target="_blank"><i>Unnamed Resource</i></a></li>\n</ul>');
        });

        it('generates an external link with unnamed resource if href is not empty and title is empty', function() {
            mockLinkObjects[0].href = "https://something.somewhere.com";
            mockInfoPanel._constructInfoTabHtml(mockAbstract, mockLinkObjects);

            expect(mockInfoPanel.update.callCount).toBe(1);
            expect(mockInfoPanel.html).toEqual(mockInfoPanel._getHtmlHeader(mockAbstract) + '<li><a class=\"external\" href=https://something.somewhere.com target="_blank"><i>Unnamed Resource</i></a></li>\n</ul>');
        });

        it('generates an external link with the link title if both are non-empty', function() {
            mockLinkObjects[0].href = "https://something.somewhere.com";
            mockLinkObjects[0].title = "Zelda";
            mockInfoPanel._constructInfoTabHtml(mockAbstract, mockLinkObjects);

            expect(mockInfoPanel.update.callCount).toBe(1);
            expect(mockInfoPanel.html).toEqual(mockInfoPanel._getHtmlHeader(mockAbstract) + '<li><a class=\"external\" href=https://something.somewhere.com target="_blank">Zelda</a></li>\n</ul>');
        });
    });
});

