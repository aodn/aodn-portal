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
            links: [
                {
                    href: 'http://host/some.html',
                    name: 'imos:radar_stations',
                    protocol: 'downloadable',
                    title: 'the title one',
                    type: 'text/html'
                }
            ]
        });

        fragment = tpl.apply(geoNetworkRecord.data);
    });

    describe('main template', function() {
        it('div cart-row', function() {
            expect($(fragment).attr('class')).toEqual('cart-row');
            expect($(fragment).children().length).toBe(2);
        });

        it('div cart-title-row', function() {
            expect($(fragment).find(':nth-child(1)').attr('class')).toEqual('cart-title-row');
            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-files');
        });

        it('div cart-files', function() {
            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-files');
            expect($(fragment).find(':nth-child(2)').children().length).toEqual(1);
            expect($(fragment).find(':nth-child(2)').children().attr('class')).toEqual('cart-file-row');
        });

        it('span cart-title', function() {
            expect($(fragment).find('span').attr('class')).toEqual('cart-title');
            expect($(fragment).find('span').text()).toEqual('the title');
        });
    });

    describe('sub template', function() {

        var htmlTitle = 'the html title';

        beforeEach(function() {
            var tpl = new Portal.cart.DownloadPanelTemplate();

            var links = [
                {
                    href: 'http://someurl',
                    title: htmlTitle,
                    type: 'text/html',
                    protocol: 'downloadable'
                },
                {
                    href: 'http://someotherurl',
                    title: htmlTitle,
                    type: 'text/html',
                    protocol: 'not downloadable'
                }
            ];

            fragment = tpl._getFileListMarkup(links);
        });

        it('only known mimetypes and downloadable links shown', function() {
            expect($(fragment).length).toBe(1);
        });

        it('links contents', function() {
            expect($(fragment).children('i').length).toBe(1);
            expect($(fragment).children('i').text()).toBe(htmlTitle);
            expect($(fragment).text()).toBe(htmlTitle + ' (.' + Portal.app.config.downloadCartMimeTypeToExtensionMapping['text/html'] + ')');
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
