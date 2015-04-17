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
        var values;

        beforeEach(function(){
            values = {
                title: "Rottnest ...QC'd (is bad for embedding in a function)",
                pointOfTruthLink: {
                    href: "http://geonetwork"
                }
            };
        });

        it('creates valid link from problematic title', function() {
            var res = facetedSearchDataView.getGeoNetworkRecordPointOfTruthLinkAsHtml(values);

            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Search','Rottnest ...QCd is bad for embedding in a function');return true;");
        });

        it('creates valid link from non-problematic title', function() {
            values.title = "Argo Profiles";
            var res = facetedSearchDataView.getGeoNetworkRecordPointOfTruthLinkAsHtml(values);

            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Search','Argo Profiles');return true;");
        });
    });

    describe('addRecordFromSuperUuid', function () {
        var record;

        beforeEach(function() {
            record = {
                data: {
                    title: "Argo Australia Profiles"
                },
                get: noOp,
                join: noOp,
                hasWmsLink: noOp
            };

            facetedSearchDataView.decodeSuperUuid = function() {
                return "my uuid";
            };

            facetedSearchDataView._getRecordFromUuid = function() {
                return record;
            };
        });

        it('sends correct tracking data', function() {
            spyOn(window, 'trackUsage');
            facetedSearchDataView.addRecordFromSuperUuid("my super uuid");
            expect(window.trackUsage).toHaveBeenCalledWith("Collection", "select", "Argo Australia Profiles");
        });
    });

    describe('_getMeasuredParametersAsCommaSeparatedString', function() {

        var params;

        beforeEach(function() {
            params = [];

            facetedSearchDataView._getMeasuredParameters = function() {
                return params;
            };
        });

        it('with some parameters', function() {
            params = ['temp', 'salinity'];
            expect(facetedSearchDataView._getMeasuredParametersText()).toEqual('temp, salinity');
        });

        it('with no parameters', function() {
            expect(facetedSearchDataView._getMeasuredParametersText()).toEqual('No parameters');
        });
    });
});
