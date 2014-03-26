/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NcwmsInjector', function() {

    var injector;
    var geoNetworkRecord;

    beforeEach(function() {
        injector = new Portal.cart.NcwmsInjector();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            ncwmsParams: {},
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                getWfsLayerFeatureRequestUrl: function() {},
                isNcwms: function() {return true},
                wfsLayer: true,
                bodaacFilterParams: {}
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
            expect(markup.indexOf(OpenLayers.i18n('notificationBlurbMessage'))).toBeGreaterThan(-1);
            expect(markup.indexOf(injector.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE)).toBeGreaterThan(-1);
            expect(markup.indexOf(OpenLayers.i18n('emailAddressPlaceholder'))).toBeGreaterThan(-1);
        });

        it('contains the user specified email address', function() {
            spyOn(injector, '_getEmailAddress').andReturn('gogo@duck.com');
            markup = injector._getDataMarkup(geoNetworkRecord);

            expect(injector._getEmailAddress).toHaveBeenCalled();
            expect(markup.indexOf('gogo@duck.com')).toBeGreaterThan(-1);
        });
    });

    describe('download handlers', function() {

        it('BODAAC _urlListDownloadHandler calls _wfsDownloadUrl', function() {
            spyOn(injector, '_wfsDownloadUrl');
            injector._urlListDownloadHandler(
                {
                    wmsLayer: {
                        grailsLayerId: 1,
                        isNcwms: function() { return true }
                    }
                }
            );
            expect(injector._wfsDownloadUrl).toHaveBeenCalled();
        });

        it('BODAAC _netCdfDownloadHandler calls _wfsDownloadUrl', function() {
            spyOn(injector, '_wfsDownloadUrl');
            injector._netCdfDownloadHandler(
                {
                    wmsLayer: {
                        grailsLayerId: 1,
                        isNcwms: function() { return true }
                    }
                }
            );
            expect(injector._wfsDownloadUrl).toHaveBeenCalled();
        });
    });

    describe('_wfsDownloadUrl', function() {

        it('calls correct function on layer', function() {

            var spy = jasmine.createSpy();
            var testLayer = {getWfsLayerFeatureRequestUrl: spy};

            injector._wfsDownloadUrl(testLayer, 'csv');

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
    });

    describe('_gogoduckUrl', function() {

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
            url = decodeURIComponent(injector._gogoduckUrl(params, 'gogo@duck.com'));
        });

        it('includes the gogoduck endpoint', function() {
            expect(url.indexOf('gogoduck/registerJob?jobParameters=')).toBeGreaterThan(-1);
        });

        it('includes the layer name', function() {
            expect(url.indexOf('gogoDingo')).not.toEqual(-1);
        });

        it('includes the longitude range start', function() {
            expect(url.indexOf('160')).not.toEqual(-1);
        });

        it('includes the longitude range end', function() {
            expect(url.indexOf('170')).not.toEqual(-1);
        });

        it('includes the latitude range start', function() {
            expect(url.indexOf('-42')).not.toEqual(-1);
        });

        it('includes the latitude range end', function() {
            expect(url.indexOf('-20')).not.toEqual(-1);
        });

        it('includes the time range start', function() {
            expect(url.indexOf('2013-11-20T00:30:00.000Z')).not.toEqual(-1);
        });

        it('includes the time range end', function() {
            expect(url.indexOf('2014-12-21T22:30:30.500Z')).not.toEqual(-1);
        });
    });

    describe('email address', function() {

        it('saves an email address', function() {
            var emailInput = new Ext.form.TextField();
            spyOn(injector, '_emailTextFieldElement').andReturn(emailInput);
            spyOn(injector, '_saveEmailAddress').andReturn(emailInput);

            injector.attachMenuEvents(geoNetworkRecord);
            emailInput.fireEvent('change');
            expect(injector._saveEmailAddress).toHaveBeenCalledWith(geoNetworkRecord.uuid);
        });

        describe('_validateEmailAddress', function () {

            it('returns false for an empty address', function () {
                var returnVal = injector._validateEmailAddress('');
                expect(returnVal).toBe(false);
            });

            it('returns false for an invalid address', function () {
                var returnVal = injector._validateEmailAddress('notAnEmailAddress');
                expect(returnVal).toBe(false);
            });

            it('returns true for a valid address', function () {
                var returnVal = injector._validateEmailAddress('user@domain.com');
                expect(returnVal).toBe(true);
            });
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
