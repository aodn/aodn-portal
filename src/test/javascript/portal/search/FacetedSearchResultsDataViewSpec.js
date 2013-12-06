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
});