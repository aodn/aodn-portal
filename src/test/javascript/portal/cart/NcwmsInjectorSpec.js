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

    describe('createMenuItems', function() {

        it('creates download options for URL list and subsetted NetCDF where supported by layer', function() {
            var menuItems;
            var urlListIncluded = false;
            var netCdfDownloadIncluded = false;
            var netCdfSubsetIncluded = false;

            injector._isSubsettedNetCdfAvailable = function() { return true; };
            injector._isUrlListDownloadAvailable = function() { return true; };

            menuItems = injector._createMenuItems(geoNetworkRecord);

            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i].text == OpenLayers.i18n('downloadAsUrlsLabel')) {
                    urlListIncluded = true;
                }
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsAllSourceNetCdfLabel')) {
                    netCdfDownloadIncluded = true;
                }
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsSubsettedNetCdfLabel')) {
                    netCdfSubsetIncluded = true;
                }
            }

            expect(menuItems.length).toEqual(3);
            expect(urlListIncluded).toBe(true);
            expect(netCdfDownloadIncluded).toBe(true);
        });

        it('creates only subsetted NetCDF menu option where bodaac is not supported', function() {
            var menuItems;
            var urlListIncluded = false;
            var netCdfDownloadIncluded = false;
            var netCdfSubsetIncluded = false;

            injector._isSubsettedNetCdfAvailable = function() { return true; };
            injector._isUrlListDownloadAvailable = function() { return false; };

            menuItems = injector._createMenuItems(geoNetworkRecord);

            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i].text == OpenLayers.i18n('downloadAsUrlsLabel')) {
                    urlListIncluded = true;
                }
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsAllSourceNetCdfLabel')) {
                    netCdfDownloadIncluded = true;
                }
                else if (menuItems[i].text == OpenLayers.i18n('downloadAsSubsettedNetCdfLabel')) {
                    netCdfSubsetIncluded = true;
                }
            }

            expect(menuItems.length).toEqual(1);
            expect(urlListIncluded).toBe(false);
            expect(netCdfDownloadIncluded).toBe(false);
        });
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

    describe('download handlers', function() {

        var downloadParams;
        var collection;

        beforeEach(function() {
            downloadParams = {};
            spyOn(injector, 'downloadWithConfirmation');
            spyOn(injector, '_getUrlListDownloadParams').andReturn(downloadParams);
            spyOn(injector, '_getNetCdfDownloadParams').andReturn(downloadParams);

            collection = {
                wmsLayer: {
                    grailsLayerId: 1,
                    isNcwms: function() { return true }
                }
            };
        });

        it('BODAAC _urlListDownloadHandler calls downloadWithConfirmation', function() {
            injector._urlListDownloadHandler(collection);

            expect(injector.downloadWithConfirmation).toHaveBeenCalledWith(
                collection,
                injector._downloadUrl,
                downloadParams
            );
        });

        it('BODAAC _netCdfDownloadHandler calls downloadWithConfirmation', function() {
            injector._netCdfDownloadHandler(collection);

            expect(injector.downloadWithConfirmation).toHaveBeenCalledWith(
                collection,
                injector._downloadUrl,
                downloadParams
            );
        });
    });

    describe('_wfsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWfsLayerFeatureRequestUrl: spy};

            injector._wfsDownloadUrl({
                wmsLayer: testLayer
            }, {
                format: 'csv'
            });

            expect(testLayer.getWfsLayerFeatureRequestUrl).toHaveBeenCalledWith('csv');
        });
    });

    describe('getDataFilterEntry', function() {

        it('still returns date range stuff with no bbox', function() {
            expect(injector._getDataFilterEntry(geoNetworkRecord)).not.toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('returns a default message when no defined date', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = undefined;
            geoNetworkRecord.ncwmsParams.dateRangeStart = null;
            expect(injector._getDataFilterEntry(geoNetworkRecord)).toEqual(OpenLayers.i18n("emptyDownloadDateRangePlaceholder"));
        });

        it('indicates a northerly bound', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = '-10';
            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('N')).toBeGreaterThan(-1);
            expect(entry.indexOf('-10')).toBeGreaterThan(-1);
            expect(entry.indexOf('N')).toBeGreaterThan(entry.indexOf('-10'));
        });

        it('indicates an easterly bound', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = '-10';
            geoNetworkRecord.ncwmsParams.longitudeRangeEnd = '170';
            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('E')).toBeGreaterThan(-1);
            expect(entry.indexOf('170')).toBeGreaterThan(-1);
            expect(entry.indexOf('E')).toBeGreaterThan(entry.indexOf('170'));
        });

        it('indicates a southerly bound', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = '-10';
            geoNetworkRecord.ncwmsParams.latitudeRangeEnd = '-40';
            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('S')).toBeGreaterThan(-1);
            expect(entry.indexOf('-40')).toBeGreaterThan(-1);
            expect(entry.indexOf('S')).toBeGreaterThan(entry.indexOf('-40'));
        });

        it('indicates an westerly bound', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = '-10';
            geoNetworkRecord.ncwmsParams.longitudeRangeStart = '150';
            var entry = injector._getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('W')).toBeGreaterThan(-1);
            expect(entry.indexOf('150')).toBeGreaterThan(-1);
            expect(entry.indexOf('W')).toBeGreaterThan(entry.indexOf('150'));
        });

        it('indicates temporal range', function() {
            geoNetworkRecord.ncwmsParams.dateRangeStart = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0));
            geoNetworkRecord.ncwmsParams.dateRangeEnd = moment.utc(Date.UTC(2014, 11, 21, 10, 30, 30, 500));

            var entry = injector._getDataFilterEntry(geoNetworkRecord);

            var startDateString = '20 Nov 2013, 00:30 UTC';
            var endDateString = '21 Dec 2014, 10:30 UTC';

            expect(entry.indexOf(startDateString)).toBeGreaterThan(-1);
            expect(entry.indexOf(endDateString)).toBeGreaterThan(-1);
            expect(entry.indexOf(startDateString)).toBeLessThan(entry.indexOf(endDateString));
        });
    });

    describe('_subsettedDownloadHandler', function() {
        it('provides a function', function() {
            expect(typeof(injector._subsettedDownloadHandler(geoNetworkRecord, 'nc'))).toEqual('function');
        });

        it('calls downloadWithConfirmation', function() {
            spyOn(injector, 'downloadWithConfirmation');
            var collection = {};
            var params = {};

            injector._subsettedDownloadHandler(collection, params);

            var expectedParams = {
                collectEmailAddress: true,
                asyncDownload: true
            };

            expect(injector.downloadWithConfirmation).toHaveBeenCalledWith(
                collection,
                injector._generateNcwmsUrl,
                expectedParams
            );
        });
    });

    describe('_generateNcwmsUrl', function() {

        var url;

        it('calls generateUrl on the aggregator object for the record', function() {

            var mockAggregatorGroup = new Portal.data.AggregatorGroup();
            var mockAggregator = new Portal.data.GogoduckAggregator();

            mockAggregatorGroup.add(mockAggregator);
            geoNetworkRecord.aggregator = mockAggregatorGroup;
            mockAggregatorGroup.getRecordAggregator = function() { return mockAggregator };

            spyOn(mockAggregator, 'generateUrl');
            url = injector._generateNcwmsUrl(geoNetworkRecord, geoNetworkRecord.ncwmsParams);
            expect(mockAggregator.generateUrl).toHaveBeenCalled();
        });
    });

    describe('_parameterString', function () {

        beforeEach(function () {
            spyOn(OpenLayers, 'i18n').andReturn('i18n value');
            spyOn(String, 'format');
            injector._parameterString('the_key', 'val1', 'val2', "delimiter");
        });

        it('calls OpenLayers.i18n()', function () {
            expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
        });

        it('calls String.format()', function () {
            expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', 'i18n value', 'val1', 'val2', "delimiter")
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
        geoNetworkRecord = {
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
                wfsLayer: true
            },
            pointOfTruthLink: 'Link!',
            downloadableLinks: 'Downloadable link!'
        }

        return geoNetworkRecord;
    }
});
