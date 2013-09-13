/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadPanelTemplate', function() {

    var fragment;
    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {

        tpl = new Portal.cart.DownloadPanelTemplate();
        geoNetworkRecord = {
            title: 'the title',
            pointOfTruthLink: {
                href: 'point of truth url'
            },
            downloadableLinks: [
                {
                    href: 'http://host/some.html',
                    name: 'imos:radar_stations',
                    title: 'the title one'
                }
            ],
            wmsLayer: {
                getCqlFilter: function() {
                    return "cql_filter"
                }
            }
        };
    });

    describe('_getPointOfTruthLinkEntry', function() {

        var html;

        beforeEach(function() {

            spyOn(tpl, '_externalLinkMarkup').andReturn('link markup');
            spyOn(tpl, '_wrapInEntryMarkup').andReturn('entry markup');

            html = tpl._getPointOfTruthLinkEntry(geoNetworkRecord);
        });

        it('returns the entry markup', function() {

            expect(html).toBe('entry markup');
        });

        it('calls _wrapInEntryMarkup', function() {

            expect(tpl._wrapInEntryMarkup).toHaveBeenCalledWith('link markup');
        });

        it('calls _externalLinkMarkup', function() {

            expect(tpl._externalLinkMarkup).toHaveBeenCalledWith('point of truth url', "View metadata record");
        });
    });

    describe('_getDataFilterEntry', function() {

        beforeEach(function() {

            spyOn(tpl, '_wrapInEntryMarkup').andReturn('entry markup');
        });

        it('returns the entry markup', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('entry markup');
        });

        it('calls entry markup with filter description', function() {

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(tpl._wrapInEntryMarkup).toHaveBeenCalledWith('Filter applied: <code>cql_filter</code>');
        });

        it('calls entry markup with no filter message', function() {

            geoNetworkRecord.wmsLayer.getCqlFilter = function() { return null };

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(tpl._wrapInEntryMarkup).toHaveBeenCalledWith('No data filters applied.');
        });

        it('returns empty string when no layer', function() {

            geoNetworkRecord.wmsLayer = null;

            var html = tpl._getDataFilterEntry(geoNetworkRecord);

            expect(html).toBe('');
            expect(tpl._wrapInEntryMarkup).not.toHaveBeenCalled();
        });

        afterEach(function() {

            tpl._wrapInEntryMarkup.reset();
        });
    });

    describe('_getDataDownloadEntry', function() {
    });

    describe('_getFileListEntries', function() {
    });

    describe('_getSingleFileEntry', function() {
    });

    describe('_wrapInEntryMarkup', function() {
    });

    describe('_externalLinkMarkup', function() {
    });

    describe('main template', function() {
//        it('has correct number of children', function() {
//            expect($(fragment).attr('class')).toEqual('cart-row');
//            expect($(fragment).children().length).toBe(3);
//        });
//
//        it('children are of correct class', function() {
//            expect($(fragment).find(':nth-child(1)').attr('class')).toEqual('cart-title-row');
//            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-data-filter');
//            expect($(fragment).find(':nth-child(3)').attr('class')).toEqual('cart-files');
//        });
//
//        it('title is correct', function() {
//            expect($(fragment).find('span').attr('class')).toEqual('cart-title');
//            expect($(fragment).find('span').text()).toEqual('the title');
//        });
//
//        it('filter info is correct', function() {
//            expect($(fragment).find(':nth-child(2)').attr('class')).toEqual('cart-data-filter');
//            expect($(fragment).find(':nth-child(2)').children().length).toEqual(1);
//            expect($(fragment).find(':nth-child(2)').children().text()).toEqual('cql_filter');
//        });
//
//        it('files info is correct', function() {
//            expect($(fragment).find(':nth-child(3)').attr('class')).toEqual('cart-files');
//            expect($(fragment).find(':nth-child(3)').children().length).toEqual(1);
//            expect($(fragment).find(':nth-child(3)').children().attr('class')).toEqual('cart-file-row');
//        });
    });
});
