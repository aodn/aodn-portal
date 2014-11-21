/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.service.SearchRequestLogger', function() {

    var searcher;
    var requestLogger;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();
        requestLogger = new Portal.service.SearchRequestLogger({
            searcher: searcher
        });
    });

    describe('searcher events', function() {
        beforeEach(function() {
            spyOn(requestLogger.stopWatch, 'getElapsedMillis');
        });

        it('starts stopwatch on search start', function() {
            spyOn(requestLogger.stopWatch, 'start');
            searcher.fireEvent('searchstart');
            expect(requestLogger.stopWatch.start).toHaveBeenCalled();
        });

        it('stops stopwatch on search complete', function() {
            spyOn(requestLogger.stopWatch, 'stop');
            searcher.fireEvent('searchcomplete');
            expect(requestLogger.stopWatch.stop).toHaveBeenCalled();
        });

        it('stops stopwatch on search error', function() {
            spyOn(requestLogger.stopWatch, 'stop');
            searcher.fireEvent('searcherror');
            expect(requestLogger.stopWatch.stop).toHaveBeenCalled();
        });
    });

    describe('logging', function() {

        it('logs "searching collections" on search start', function() {
            spyOn(requestLogger, '_logSearchStart');
            searcher.fireEvent('searchstart');

            expect(requestLogger._logSearchStart).toHaveBeenCalled();
        });

        it('logs elapsed time on search complete', function() {
            spyOn(log, 'info');
            spyOn(requestLogger.stopWatch, 'getElapsedMillis').andReturn(123);

            searcher.fireEvent('searchcomplete');

            expect(log.info).toHaveBeenCalledWith('Searched collections: {"status":"success","duration (ms)":123}');
        });

        it('logs elapsed time on search error', function() {
            spyOn(log, 'warn');
            spyOn(requestLogger.stopWatch, 'getElapsedMillis').andReturn(123);

            searcher.fireEvent('searcherror');

            expect(log.warn).toHaveBeenCalledWith('Searched collections: {"status":"failed","duration (ms)":123}');
        });
    });
});
