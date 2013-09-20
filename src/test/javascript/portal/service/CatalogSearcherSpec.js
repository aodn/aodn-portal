/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.service.CatalogSearcher', function() {

    var searcher;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();
    });

    describe('events', function() {
        var response;
        var options;

        beforeEach(function() {
            spyOn(searcher, 'fireEvent');
            response = {
                responseXML: {}
            };
            options = {
                page: {}
            };
        });

        it('fires searchstart on search', function() {
            searcher.search();
            expect(searcher.fireEvent).toHaveBeenCalledWith('searchstart');
        });

        it('fires searchcomplete on successful search', function() {
            searcher._onSuccessfulSearch(response, options);
            expect(searcher.fireEvent).toHaveBeenCalledWith('searchcomplete', response.responseXML, options.page);
        });

        it('fires searchcomplete on successful summary search', function() {
            searcher._onSuccessfulSummarySearch(response, options);
            expect(searcher.fireEvent).toHaveBeenCalledWith('summaryOnlySearchComplete', response.responseXML, options.page);
        });
    });
});
