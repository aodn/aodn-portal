/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NcwmsInjector', function() {

    var injector;
    var geoNetworkRecord;
    var startDate;
    var endDate;

    beforeEach(function() {
        injector = new Portal.cart.NcwmsInjector();
        startDate = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0)); // NB.Months are zero indexed
        endDate = moment.utc(Date.UTC(2014, 11, 21, 22, 30, 30, 500));
        geoNetworkRecord = getMockGeonetworkRecord();
    });

    describe('getDataMarkup', function() {

        var markup;

        beforeEach(function() {

            markup = injector._getDataMarkup(geoNetworkRecord);
        });

        it('generates correct markup for ncwms layers', function() {
            expect(markup).not.toEqual('');
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingMessage"))).toBeGreaterThan(-1);
            expect(markup.indexOf(OpenLayers.i18n("estimatedDlLoadingSpinner"))).toBeGreaterThan(-1);
        });
    });

    describe('getDataFilterEntry', function() {

        beforeEach(function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = '-10';
            geoNetworkRecord.ncwmsParams.latitudeRangeEnd = '40';
            geoNetworkRecord.ncwmsParams.longitudeRangeEnd = '180';
            geoNetworkRecord.ncwmsParams.longitudeRangeStart = '150';
        });

        it('still returns date range stuff with no bbox', function() {
            expect(injector._getDataFilterEntry(geoNetworkRecord)).not.toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('returns a default message when no defined date', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = undefined;
            geoNetworkRecord.ncwmsParams.dateRangeStart = null;
            expect(injector._getDataFilterEntry(geoNetworkRecord)).toEqual(OpenLayers.i18n("emptyDownloadPlaceholder"));
        });

        it('indicates bounds properly created', function() {

            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf(OpenLayers.i18n("boundingBoxDescriptionNcWms"))).toBeGreaterThan(-1);
        });

        it('indicates temporal range', function() {
            geoNetworkRecord.ncwmsParams.dateRangeStart = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0));
            geoNetworkRecord.ncwmsParams.dateRangeEnd = moment.utc(Date.UTC(2014, 11, 21, 10, 30, 30, 500));

            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf(OpenLayers.i18n('parameterDateLabel'))).toBeGreaterThan(-1);

            entry = injector._formatHumanDateInfo('parameterDateLabel', 'startdate', 'enddate');
            expect(entry.indexOf('startdate')).toBeGreaterThan(-1);
        });
    });

    describe('getPointOfTruthLinks', function() {

        it('returns point of truth links as appropriate', function() {
            expect(injector._getPointOfTruthLink(geoNetworkRecord)).toEqual('Link!');
        });
    });

    describe('getMetadataLinks', function() {

        it('returns metadata links as appropriate', function() {
            expect(injector._getMetadataLinks(geoNetworkRecord)).toEqual('Downloadable link!');
        });
    });

    function getMockGeonetworkRecord() {

        return {
            uuid: 9,
            grailsLayerId: 42,
            ncwmsParams: {
                dateRangeStart: startDate,
                dateRangeEnd: endDate,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170,
                layerName: "gogoDingo"
            },
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                getWfsLayerFeatureRequestUrl: noOp,
                isNcwms: function() {return true},
                wfsLayer: {
                    server: {uri: 'wfs_server_url'}
                }
            },
            pointOfTruthLink: 'Link!',
            linkedFiles: 'Downloadable link!'
        };
    }
});
