describe("Portal.search.FacetedSearchResultsDataView", function() {

    var facetedSearchDataView;
    var testString;
    var template;

    beforeEach(function() {
        spyOn(Portal.data.DataCollection.prototype, 'isNcwms');

        facetedSearchDataView = new Portal.search.FacetedSearchResultsDataView({
            dataCollectionStore: {
                getByUuid: noOp,
                findBy: noOp,
                add: noOp
            }
        });
        facetedSearchDataView._getFacetParentPath = returns("this/is/the/path");

        testString = "2000-12-31t13:00:00.000z";
        template = new Ext.Template(
            '<div><span class="x-panel-header">{label}</span>',
            '   <span>- {value}</span>',
            '</div>'
        );
        viewport = {
            setActiveTab: jasmine.createSpy('setActiveTab')
        };
    });

    describe ('encoding and decoding', function() {
        it('encodes correctly', function() {
            expect(facetedSearchDataView.elementIdFromUuid('prefix', "1231-456-789")).toBe("prefix-1231-456-789");
            expect(facetedSearchDataView.mapElementId("1231-456-789")).toBe(facetedSearchDataView.MAP_ID_PREFIX + "-1231-456-789");
        });
        it('decodes correctly', function() {
            expect(facetedSearchDataView.uuidFromElementId(facetedSearchDataView.MAP_ID_PREFIX + "-1231-456-789")).toBe("1231-456-789");
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

    describe('getMetadataRecordPointOfTruthLinkAsHtml', function() {
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
            var res = facetedSearchDataView.getMetadataRecordPointOfTruthLinkAsHtml(values);

            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Search','Rottnest ...QCd is bad for embedding in a function');return true;");
        });

        it('creates valid link from non-problematic title', function() {
            values.title = "Argo Profiles";
            var res = facetedSearchDataView.getMetadataRecordPointOfTruthLinkAsHtml(values);

            expect(res).toContain('http://geonetwork');
            expect(res).toContain("trackUsage('Metadata','Search','Argo Profiles');return true;");
        });
    });

    describe('addRecordWithUuid', function () {
        var record;

        beforeEach(function() {
            spyOn(Portal.data.DataCollection.prototype, '_loadFilters');

            record = {
                get: returns("Argo Australia Profiles"),
                join: noOp
            };

            facetedSearchDataView.uuidFromElementId = returns("my uuid");

            facetedSearchDataView.store = {
                getByUuid: returns(record)
            };

            spyOn(window, 'trackUsage');
        });

        it('sends correct tracking data', function() {

            facetedSearchDataView.addRecordWithUuid("my super uuid", false);
            expect(window.trackUsage).toHaveBeenCalledWith("Collection", "select", "Argo Australia Profiles", undefined);
        });

        it('clears possible contents of buttons/maps', function() {

            spyOn(window, 'clearContents');
            facetedSearchDataView.createButton("my super uuid");
            expect(clearContents).toHaveBeenCalled();
        });

        it('sends user to step 2 for normal select', function() {

            facetedSearchDataView.addRecordWithUuid("my super uuid", false);
            expect(viewport.setActiveTab).toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });

        it('does not send user to step 2 for multi select', function() {

            facetedSearchDataView.addRecordWithUuid("my super uuid", true);
            expect(viewport.setActiveTab).not.toHaveBeenCalledWith(TAB_INDEX_VISUALISE);
        });
    });

    describe('_getMeasuredParametersAsCommaSeparatedString', function() {

        it('with some parameters', function() {
            facetedSearchDataView._getMeasuredParameters = returns(['temp', 'salinity']);

            expect(facetedSearchDataView._getFacetSearchLinks('temp', 'salinity')).toEqual('<span class="facetSearchHyperLink" data="this/is/the/path">salinity</span>');
        });

        it('with no parameters', function() {
            facetedSearchDataView._getMeasuredParameters = returns([]);

            expect(facetedSearchDataView._getFacetSearchLinks('temp', undefined)).toEqual('');
        });
    });
});
