/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NcwmsInjector', function() {

    var injector;
    var dataCollection;
    var startDate;
    var endDate;

    var dateLabel = OpenLayers.i18n('temporalExtentHeading');

    beforeEach(function() {
        injector = new Portal.cart.NcwmsInjector();
        startDate = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0)); // NB.Months are zero indexed
        endDate = moment.utc(Date.UTC(2014, 11, 21, 22, 30, 30, 500));
        dataCollection = getMockDataCollection();
    });

    describe('getDataFilterEntry', function() {

        beforeEach(function() {
            dataCollection.ncwmsParams.latitudeRangeStart = '-10';
            dataCollection.ncwmsParams.latitudeRangeEnd = '40';
            dataCollection.ncwmsParams.longitudeRangeEnd = '180';
            dataCollection.ncwmsParams.longitudeRangeStart = '150';
        });

        it('still returns date range stuff with no bbox', function() {
            expect(injector._getDataFilterEntry(dataCollection)).not.toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('returns a default message when no defined date', function() {
            dataCollection.ncwmsParams.latitudeRangeStart = undefined;
            dataCollection.ncwmsParams.dateRangeStart = null;
            expect(injector._getDataFilterEntry(dataCollection)).toEqual(OpenLayers.i18n("emptyDownloadPlaceholder"));
        });

        it('indicates bounds properly created', function() {

            var entry = injector._getDataFilterEntry(dataCollection);
            expect(entry).toContain(OpenLayers.i18n("spatialExtentHeading"));
        });

        it('indicates temporal range', function() {
            dataCollection.ncwmsParams.dateRangeStart = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0));
            dataCollection.ncwmsParams.dateRangeEnd = moment.utc(Date.UTC(2014, 11, 21, 10, 30, 30, 500));

            var entry = injector._getDataFilterEntry(dataCollection);
            expect(entry).toContain(dateLabel);

            entry = injector._formatHumanDateInfo('temporalExtentHeading', 'startdate', 'enddate');
            expect(entry).toContain(dateLabel);
            expect(entry).toContain('startdate');
            expect(entry).toContain('enddate');
        });
    });

    function getMockDataCollection() {

        return {
            uuid: 9,
            ncwmsParams: {
                dateRangeStart: startDate,
                dateRangeEnd: endDate,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170
            }
        };
    }
});
