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
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            ncwmsParams: {
                dateRangeStart: startDate,
                dateRangeEnd: endDate,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170
            },
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                getWfsLayerFeatureRequestUrl: noOp,
                isNcwms: function() {return true},
                wfsLayer: true,
                bodaacFilterParams: {},
                aodaacProducts: [],
                isAodaac: noOp
            },
            pointOfTruthLink: 'Link!',
            downloadableLinks: 'Downloadable link!'
        }
    });

    describe('createMenuItems', function() {

        it('create menu items for ncwms layers', function() {
            var menuItems = injector._createMenuItems(geoNetworkRecord);
            var urlListIncluded = false;
            var netCdfDownloadIncluded = false;
            var netCdfSubsetIncluded = false;

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
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = undefined;
            geoNetworkRecord.ncwmsParams.dateRangeStart = new Date(0);
            geoNetworkRecord.ncwmsParams.dateRangeEnd = new Date(1);
            expect(injector._getDataFilterEntry(geoNetworkRecord)).not.toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('returns a no filter label if no bbox and no defined date', function() {
            geoNetworkRecord.ncwmsParams.latitudeRangeStart = undefined;
            geoNetworkRecord.ncwmsParams.dateRangeStart = null;
            expect(injector._getDataFilterEntry(geoNetworkRecord)).toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
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

    describe('_downloadGogoduckHandler', function() {
        it('provides a function', function() {
            expect(typeof(injector._downloadGogoduckHandler(geoNetworkRecord, 'nc'))).toEqual('function');
        });

        it('calls downloadWithConfirmation', function() {
            spyOn(injector, 'downloadWithConfirmation');
            var collection = {};
            var params = {};

            injector._downloadGogoduckHandler(collection, params);

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
        var format;
        var emailAddress;
        var collection;
        var ncwmsParams;
        var params;

        beforeEach(function() {

            format  = 'csv';
            emailAddress = 'gogo@duck.com';
            params = { format: format, emailAddress: emailAddress };

            ncwmsParams = {
                dateRangeStart: startDate,
                dateRangeEnd: endDate,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170
            };

            collection = { ncwmsParams: ncwmsParams };

            spyOn(injector, '_generateAodaacJobUrl');
            spyOn(injector, '_generateGogoduckJobUrl');
        });

        it('calls _generateAodaacJobUrl when an aodaac record is passed', function() {

            ncwmsParams.productId = 'gogoAodaac';

            url = injector._generateNcwmsUrl(collection, params);
            expect(injector._generateAodaacJobUrl).toHaveBeenCalled();
        });

        it('calls _generateGogoduckJobUrl when a gogoduck record is passed', function() {

            ncwmsParams.layerName = 'gogoDingo';

            url = injector._generateNcwmsUrl(collection, params);
            expect(injector._generateGogoduckJobUrl).toHaveBeenCalled();
        });
    });

    describe('_generateAodaacJobUrl', function() {

        var url;
        var params = {
            dateRangeStart: new Date(0),
            dateRangeEnd: new Date(),
            latitudeRangeStart: -42,
            latitudeRangeEnd: -20,
            longitudeRangeStart: 160,
            longitudeRangeEnd: 170,
            productId: 1
        };

        beforeEach(function() {
            url = injector._generateAodaacJobUrl(params, 'nc', 'aodaac@imos.org.au');
        });

        it('includes the aodaac endpoint', function() {
            expect(url.indexOf('aodaac/createJob?')).toBeGreaterThan(-1);
        });

        it('includes the output format', function() {
            expect(url).toHaveParameterWithValue('outputFormat', 'nc');
        });

        it('includes the product id', function() {
            expect(url).toHaveParameterWithValue('productId', '1');
        });

        it('includes the date range start', function() {
            expect(url).toHaveParameterWithValue('dateRangeStart', params.dateRangeStart);
        });

        it('includes the date range end', function() {
            expect(url).toHaveParameterWithValue('dateRangeEnd', params.dateRangeEnd);
        });

        it('includes the latitude range start', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeStart','-42');
        });

        it('includes the latitude range end', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeEnd', '-20');
        });

        it('includes the longitude range start', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeStart', '160');
        });

        it('includes the longitude range end', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeEnd', '170');
        });
    });

    describe('_generateGogoduckJobUrl', function() {

        var url;
        var startDate = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0)); // NB.Months are zero indexed
        var endDate = moment.utc(Date.UTC(2014, 11, 21, 22, 30, 30, 500));

        var params = {
            dateRangeStart: startDate,
            dateRangeEnd: endDate,
            latitudeRangeStart: -42,
            latitudeRangeEnd: -20,
            longitudeRangeStart: 160,
            longitudeRangeEnd: 170,
            layerName: "gogoDingo"
        };

        beforeEach(function() {
            url = decodeURIComponent(injector._generateGogoduckJobUrl(params, 'gogo@duck.com'));
        });

        it('generates the gogoduck endpoint', function() {
            expect(url.indexOf('gogoduck/registerJob?jobParameters=')).toBeGreaterThan(-1);
        });

        it('generates the layer name', function() {
            expect(url.indexOf('gogoDingo')).not.toEqual(-1);
        });

        it('generates the longitude range start', function() {
            expect(url.indexOf('160')).not.toEqual(-1);
        });

        it('generates the longitude range end', function() {
            expect(url.indexOf('170')).not.toEqual(-1);
        });

        it('generates the latitude range start', function() {
            expect(url.indexOf('-42')).not.toEqual(-1);
        });

        it('generates the latitude range end', function() {
            expect(url.indexOf('-20')).not.toEqual(-1);
        });

        it('generates the time range start', function() {
            expect(url.indexOf('2013-11-20T00:30:00.000Z')).not.toEqual(-1);
        });

        it('generates the time range end', function() {
            expect(url.indexOf('2014-12-21T22:30:30.500Z')).not.toEqual(-1);
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
});
