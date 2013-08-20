/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelTemplate', function() {

    var fragment;

    beforeEach(function() {
        Portal.app = {
            config: {
                downloadCartMimeTypeToExtensionMapping: {
                    "text/html":"html"
                },
                downloadCartDownloadableProtocols: 'downloadable\nsome other downloadable protocol\n'
            }
        };

        var tpl = new Portal.cart.DownloadPanelTemplate();
        var geoNetworkRecord = new Portal.data.GeoNetworkRecord({
            title: 'the title',
            downloadableLinks: [
                {
                    href: 'http://host/some.html',
                    name: 'imos:radar_stations',
                    protocol: 'downloadable',
                    title: 'the title one',
                    type: 'text/html'
                }
            ],
            wmsLayer: {
                params: {
                    CQL_FILTER: "cql_filter"
                }
            }
        });

        fragment = tpl.apply(geoNetworkRecord.data);
    });

    describe('main template', function() {
        it('has correct number of children', function() {
            expect($(fragment).attr('class')).toEqual('cart-row');
            expect($(fragment).children().length).toBe(3);
        });

        it('children are of correct class', function() {
            expect($(fragment).find(':nth-child(1)').attr('class')).toEqual('cart-title-row');
            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-data-filter');
            expect($(fragment).find(':nth-child(3)').attr('class')).toEqual('cart-files');
        });

        it('title is correct', function() {
            expect($(fragment).find('span').attr('class')).toEqual('cart-title');
            expect($(fragment).find('span').text()).toEqual('the title');
        });

        it('filter info is correct', function() {
            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-data-filter');
            expect($(fragment).find(':nth-child(2)').children().length).toEqual(1);
            expect($(fragment).find(':nth-child(2)').children().text()).toEqual('cql_filter');
        });

        it('files info is correct', function() {
            expect($(fragment).find(':nth-child(3)').attr('class')).toEqual('cart-files');
            expect($(fragment).find(':nth-child(3)').children().length).toEqual(1);
            expect($(fragment).find(':nth-child(3)').children().attr('class')).toEqual('cart-file-row');
        });
    });

    describe('sub template', function() {

        var expectedTitles = ['title 1', 'title 2'];

        beforeEach(function() {
            var tpl = new Portal.cart.DownloadPanelTemplate();

            var links = [
                {
                    href: 'http://someurl',
                    title: expectedTitles[0],
                    type: 'application/vnd.ogc.wms_xml',
                    protocol: 'downloadable'
                },
                {
                    href: 'http://someurl',
                    title: expectedTitles[1],
                    type: 'text/html',
                    protocol: 'downloadable'
                }
            ];

            fragment = tpl._getFileListMarkup(links);
        });

        it('links contents', function() {
            expect($(fragment).children('i').length).toBe(2);

            $(fragment).children('i').each(function(i, el) {
                expect($(el).text()).toBe(expectedTitles[i]);
            });
        });
    });

    describe('_fileExtensionInfo', function() {

        var tpl;

        beforeEach(function() {
            tpl = new Portal.cart.DownloadPanelTemplate();
        });

        it('should return a formatted extension for a known mime type', function() {
            expect(tpl._fileExtensionInfo('text/html')).toBe(' (.html)');
        });

        it('should return an empty string for an unknown mime type', function() {
            expect(tpl._fileExtensionInfo('text/unknown')).toBe('');
        });
    });
});
