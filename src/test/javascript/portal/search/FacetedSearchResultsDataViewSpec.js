/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResultsDataView", function() {

    var facetedSearchDataView;
    var testString;
    var template;

    beforeEach(function() {
        facetedSearchDataView = new Portal.search.FacetedSearchResultsDataView();
        testString = "2000-12-31t13:00:00.000z";
        template = new Ext.Template(
            '<div><span class="x-panel-header">{label}</span>',
            '   <span>- {value}</span>',
            '</div>'
        );
    });

    describe ('TPL parameters', function() {
        it('has TPL parameters set', function() {
            expect(facetedSearchDataView.resultBodyHeight).not.toBeNull();
            expect(facetedSearchDataView.textBodyLeftMargin).not.toBeNull();
        });
    });

    describe ('encoding and decoding', function() {
        it('encodes correctly', function() {
            expect(facetedSearchDataView.superEncodeUuid(0,"1231-456-789")).toBe("-0-1231-456-789");
            expect(facetedSearchDataView.getUniqueId(0,"1231-456-789")).toBe(facetedSearchDataView.MAP_ID_PREFIX + "-0-1231-456-789");
        });
        it('decodes correctly', function() {
            expect(facetedSearchDataView.decodeSuperUuid("-0-1231-456-789")).toBe("1231-456-789");
        });
    });

    describe('_getTemporalExtentAsHtml', function() {
        it('returns string containing date range', function() {
            spyOn(facetedSearchDataView, '_formatTemporalExtentDateString');
            facetedSearchDataView._getTemporalExtentAsHtml(template, {
                begin: testString,
                end: testString
            });
            expect(facetedSearchDataView._formatTemporalExtentDateString).toHaveBeenCalled();
        });
    });

    describe('_formatTemporalExtentDateString', function() {
        it('parses date into formatted string', function() {
            spyOn(facetedSearchDataView, '_parseTemporalExtentDateString').andCallThrough();
            facetedSearchDataView._formatTemporalExtentDateString(testString);
            expect(facetedSearchDataView._parseTemporalExtentDateString).toHaveBeenCalled();
        });
    });

    describe('getGeoNetworkRecordPointOfTruthLinkAsHtml', function() {
        it('creates valid link', function() {
            var values = {
                title: "Rottnest ...QC'd (is bad for embedding in a function)",
                pointOfTruthLink: {
                    href: "http://blagh",
                    title: "the title"
                }
            };
            var res = facetedSearchDataView.getGeoNetworkRecordPointOfTruthLinkAsHtml(values);
            expect(res).toContain('Rottnest ...QCd is bad for embedding in a function')
        });
    });



});
