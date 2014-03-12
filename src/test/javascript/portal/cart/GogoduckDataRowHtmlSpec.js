/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.GogoduckDataRowHtml', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.GogoduckDataRowHtml();
        geoNetworkRecord = {
            uuid: 9,
            grailsLayerId: 42,
            gogoduckParams: {},
            wmsLayer: {
                getDownloadFilter: function() {
                    return "cql_filter"
                },
                isNcwms: function() {return true},
                wfsLayer: true
            }
        }
    });

    describe('getDataFilterEntry', function() {

        it('still returns date range stuff with no bbox', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = undefined;
            geoNetworkRecord.gogoduckParams.dateRangeStart = new Date(0);
            expect(tpl.getDataFilterEntry(geoNetworkRecord)).not.toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('returns a no filter label if no bbox and no defined date', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = undefined;
            geoNetworkRecord.gogoduckParams.dateRangeStart = 'Invalid date';
            expect(tpl.getDataFilterEntry(geoNetworkRecord)).toEqual(String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel")));
        });

        it('indicates a northerly bound', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = '-10';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('N')).toBeGreaterThan(-1);
            expect(entry.indexOf('-10')).toBeGreaterThan(-1);
            expect(entry.indexOf('N')).toBeGreaterThan(entry.indexOf('-10'));
        });

        it('indicates an easterly bound', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = '-10';
            geoNetworkRecord.gogoduckParams.longitudeRangeEnd = '170';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('E')).toBeGreaterThan(-1);
            expect(entry.indexOf('170')).toBeGreaterThan(-1);
            expect(entry.indexOf('E')).toBeGreaterThan(entry.indexOf('170'));
        });

        it('indicates a southerly bound', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = '-10';
            geoNetworkRecord.gogoduckParams.latitudeRangeEnd = '-40';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('S')).toBeGreaterThan(-1);
            expect(entry.indexOf('-40')).toBeGreaterThan(-1);
            expect(entry.indexOf('S')).toBeGreaterThan(entry.indexOf('-40'));
        });

        it('indicates an westerly bound', function() {
            geoNetworkRecord.gogoduckParams.latitudeRangeStart = '-10';
            geoNetworkRecord.gogoduckParams.longitudeRangeStart = '150';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('W')).toBeGreaterThan(-1);
            expect(entry.indexOf('150')).toBeGreaterThan(-1);
            expect(entry.indexOf('W')).toBeGreaterThan(entry.indexOf('150'));
        });
    });

    describe('create menu items for gogoduck layers', function() {
        var items;

        beforeEach(function() {
            items = tpl.createMenuItems(geoNetworkRecord);
        });

        it('creates menu items', function() {
            expect(items.length).toBeGreaterThan(0);
        });

        it('allows nc download', function() {
            expect(itemsContains('downloadAsNetCdfLabel')).toBe(true);
        });

        it('allows hdf download', function() {
            expect(itemsContains('downloadAsHdfLabel')).toBe(true);
        });

        it('allows ascii download', function() {
            expect(itemsContains('downloadAsAsciiLabel')).toBe(true);
        });

        it('allows urls download', function() {
            expect(itemsContains('downloadAsOpenDapUrlsLabel')).toBe(true);
        });

        function itemsContains(type) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].text == OpenLayers.i18n(type)) {
                    return true;
                }
            }
            return false;
        }
    });

    describe('getDataSpecificMarkup generates gogoduck specific markup', function() {
        var markup;

        beforeEach(function() {
            markup = tpl.getDataSpecificMarkup(geoNetworkRecord);
        });

        it('provides markup', function() {
            expect(markup).not.toEqual('');
        });

        it('contains the blurb', function() {
            expect(markup.indexOf(OpenLayers.i18n('notificationBlurbMessage'))).toBeGreaterThan(-1);
        });

        it('contains an input for an email address', function() {
            expect(markup.indexOf(tpl.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE)).toBeGreaterThan(-1);
        });

        it('contains the email address place holder when there is no email address', function() {
            expect(markup.indexOf(OpenLayers.i18n('emailAddressPlaceholder'))).toBeGreaterThan(-1);
        });

        it('contains the user specified email address', function() {
            spyOn(tpl, '_getEmailAddress').andReturn('gogo@duck.com');
            var _markup = tpl.getDataSpecificMarkup(geoNetworkRecord);

            expect(tpl._getEmailAddress).toHaveBeenCalled();
            expect(_markup.indexOf('gogo@duck.com')).toBeGreaterThan(-1);
        });
    });

    describe('_downloadGogoduckHandler', function() {
        it('provides a function', function() {
            expect(typeof(tpl._downloadGogoduckHandler(geoNetworkRecord, 'nc'))).toEqual('function');
        });
    });

    describe('_gogoduckUrl', function() {

        var url;
        var startDate = new Date(0);
        var endDate = new Date();

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
            url = tpl._gogoduckUrl(params, 'gogo@duck.com');
        });

        it('includes the gogoduck endpoint', function() {
            expect(url.indexOf('gogoduck/createJob?')).toBeGreaterThan(-1);
        });

        it('includes the date range start', function() {
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
    });

    describe('email address', function() {

        it('saves an email address', function() {
            var emailInput = new Ext.form.TextField();
            spyOn(tpl, '_emailTextFieldElement').andReturn(emailInput);
            spyOn(tpl, '_saveEmailAddress').andReturn(emailInput);

            tpl.attachMenuEvents(geoNetworkRecord);
            emailInput.fireEvent('change');
            expect(tpl._saveEmailAddress).toHaveBeenCalledWith(geoNetworkRecord.uuid);
        });

        describe('_validateEmailAddress', function () {

            it('returns false for an empty address', function () {
                var returnVal = tpl._validateEmailAddress('');
                expect(returnVal).toBe(false);
            });

            it('returns false for an invalid address', function () {
                var returnVal = tpl._validateEmailAddress('notAnEmailAddress');
                expect(returnVal).toBe(false);
            });

            it('returns true for a valid address', function () {
                var returnVal = tpl._validateEmailAddress('user@domain.com');
                expect(returnVal).toBe(true);
            });
        });
    });

    describe('_parameterString', function () {

        beforeEach(function () {
            spyOn(OpenLayers, 'i18n').andReturn('i18n value');
            spyOn(String, 'format');
            tpl._parameterString('the_key', 'val1', 'val2', "delimiter");
        });

        it('calls OpenLayers.i18n()', function () {
            expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
        });

        it('calls String.format()', function () {
            expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', 'i18n value', 'val1', 'val2', "delimiter")
        });
    });
});
